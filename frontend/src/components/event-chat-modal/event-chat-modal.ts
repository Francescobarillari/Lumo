import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';
import { ChatPoll, ChatPollOption } from '../../models/chat-poll';
import { ChatMute } from '../../models/chat-mute';
import { Event as LumoEvent } from '../../models/event';
import { User } from '../../models/user';

@Component({
  selector: 'event-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './event-chat-modal.html',
  styleUrl: './event-chat-modal.css'
})
export class EventChatModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() event!: LumoEvent;
  @Input() currentUserId: string | null = null;
  @Input() showBackArrow = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  polls: ChatPoll[] = [];
  mutes: ChatMute[] = [];
  mutedUserIds = new Set<number>();
  isMuted = false;
  isOrganizer = false;

  messageText = '';
  pollQuestion = '';
  pollOptions: string[] = ['', '', ''];
  pollSelections: Record<number, Set<number>> = {};
  pollError = '';
  showPollPopup = false;
  pinnedId: number | null = null;
  pinnedType: 'message' | 'poll' | null = null;
  pinnedItem: ChatMessage | ChatPoll | null = null;
  activePinId: number | null = null;
  activePinType: 'message' | 'poll' | null = null;
  bannedPatterns: RegExp[] = [];
  bannedRaw: string[] = [];
  messageError = '';
  timelineItems: Array<{ type: 'message' | 'poll'; createdAt: string; message?: ChatMessage; poll?: ChatPoll }> = [];
  infoMessages: Array<{
    key: 'time' | 'place' | 'rules' | 'link';
    label: string;
    content: string;
    anchorId: string;
    link?: string;
  }> = [];

  private eventSource: EventSource | null = null;

  constructor(
    private chatService: ChatService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeChat();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] || changes['currentUserId']) {
      this.initializeChat();
    }
  }

  ngOnDestroy(): void {
    this.persistMessages();
    this.eventSource?.close();
  }

  onClose() {
    this.close.emit();
  }

  openPollPopup() {
    this.pollQuestion = '';
    this.pollOptions = ['', '', ''];
    this.pollError = '';
    this.showPollPopup = true;
  }

  closePollPopup() {
    this.showPollPopup = false;
    this.pollError = '';
  }

  addPollOption() {
    if (this.pollOptions.length < 5) {
      this.pollOptions.push('');
    }
  }

  removePollOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions.splice(index, 1);
    }
  }

  copyLink(url: string) {
    if (this.clipboard.copy(url)) {
      this.snackBar.open('Link copied to clipboard', 'OK', {
        duration: 2500,
        panelClass: ['toast-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  sendMessage() {
    if (!this.currentUserId || !this.messageText.trim()) return;
    const content = this.messageText.trim();
    this.messageText = '';
    if (this.isBannedMessage(content)) {
      this.messageError = 'Messaggio non consentito.';
      return;
    }
    this.messageError = '';
    this.chatService.checkMessage(content).subscribe({
      next: (res) => {
        if (res?.banned) {
          this.messageError = 'Messaggio non consentito.';
          return;
        }
        this.chatService.sendMessage(this.event.id, this.currentUserId as string, content).subscribe({
          next: (message) => {
            this.addMessage(message);
          },
          error: (err) => {
            const apiError = err?.error?.data?.content || err?.error?.error;
            if (apiError) {
              this.messageError = apiError;
            }
            console.error('Error sending message', err);
          }
        });
      },
      error: (err) => {
        this.messageError = 'Message not allowed.';
        console.error('Error checking message', err);
      }
    });
  }

  createPoll() {
    if (!this.currentUserId || !this.pollQuestion.trim()) return;
    const options = this.pollOptions
      .map(line => line.trim())
      .filter(Boolean);
    if (options.length < 2) {
      this.pollError = 'Please enter at least two options.';
      return;
    }
    if (options.length > 5) {
      this.pollError = 'Maximum 5 options allowed.';
      return;
    }
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10);
    const endsAtIso = futureDate.toISOString().split('.')[0];

    this.chatService.createPoll(this.event.id, this.currentUserId, this.pollQuestion.trim(), options, endsAtIso)
      .subscribe({
        next: (poll) => {
          this.upsertPoll(poll);
          this.pollQuestion = '';
          this.pollOptions = ['', '', ''];
          this.showPollPopup = false;
          this.pollError = '';
          this.loadPolls();
        },
        error: (err) => {
          console.error('Error creating poll', err);
          this.pollError = 'Error creating poll.';
        }
      });
  }

  toggleVote(poll: ChatPoll, optionId: number) {
    if (!this.currentUserId || poll.closed) return;

    this.chatService.votePoll(this.event.id, poll.id, this.currentUserId, [optionId]).subscribe({
      next: (updated) => this.upsertPoll(updated),
      error: (err) => console.error('Error voting poll', err)
    });
  }


  closePoll(poll: ChatPoll) {
    if (!this.currentUserId) return;
    this.chatService.closePoll(this.event.id, poll.id, this.currentUserId).subscribe({
      next: (updated) => this.upsertPoll(updated),
      error: (err) => console.error('Error closing poll', err)
    });
  }

  muteUser(user: User) {
    if (!this.currentUserId) return;
    this.chatService.muteUser(this.event.id, this.currentUserId, user.id).subscribe({
      next: (mute) => {
        this.mutes = [...this.mutes.filter(m => m.userId !== mute.userId), mute];
        this.mutedUserIds.add(mute.userId);
      },
      error: (err) => console.error('Error muting user', err)
    });
  }

  unmuteUser(user: User) {
    if (!this.currentUserId) return;
    this.chatService.unmuteUser(this.event.id, this.currentUserId, user.id).subscribe({
      next: () => {
        this.mutes = this.mutes.filter(m => m.userId !== user.id);
        this.mutedUserIds.delete(user.id);
      },
      error: (err) => console.error('Error unmuting user', err)
    });
  }

  isUserMuted(userId: number): boolean {
    return this.mutedUserIds.has(userId);
  }

  getParticipants(): User[] {
    return this.event.acceptedUsersList || [];
  }

  formatTimestamp(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  formatDateTime(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  getOptionVoters(option: ChatPollOption): string {
    if (!option.voters || option.voters.length === 0) return '';
    return option.voters.map(voter => voter.userName).join(', ');
  }

  shouldHideSender(index: number): boolean {
    if (index === 0) return false;
    const curr = this.timelineItems[index];
    const prev = this.timelineItems[index - 1];

    if (curr.type !== 'message' || !curr.message) return false;
    if (prev.type !== 'message' || !prev.message) return false;

    return curr.message.senderId === prev.message.senderId;
  }

  private rebuildTimelineItems() {
    const items: Array<{ type: 'message' | 'poll'; createdAt: string; message?: ChatMessage; poll?: ChatPoll }> = [];
    this.messages.forEach(message => items.push({ type: 'message', createdAt: message.createdAt, message }));
    this.polls.forEach(poll => items.push({ type: 'poll', createdAt: poll.createdAt, poll }));
    this.timelineItems = items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getPollTotalVotes(poll: ChatPoll): number {
    return poll.options.reduce((sum, option) => sum + (option.voters?.length || 0), 0);
  }

  getPollOptionCount(option: ChatPollOption): number {
    return option.voters?.length || 0;
  }

  getPollBarWidth(poll: ChatPoll, option: ChatPollOption): string {
    const total = this.getPollTotalVotes(poll);
    if (!total) return '0%';
    const count = this.getPollOptionCount(option);
    return `${Math.round((count / total) * 100)}%`;
  }

  getPinnedSenderName(): string {
    if (!this.pinnedItem) return '';
    if (this.pinnedType === 'poll') return 'Sondaggio';
    return (this.pinnedItem as ChatMessage).senderName || 'Utente';
  }

  getPinnedDisplayText(): string {
    if (!this.pinnedItem) return '';
    if (this.pinnedType === 'poll') return (this.pinnedItem as ChatPoll).question;
    return (this.pinnedItem as ChatMessage).content;
  }

  isPinned(id: number, type: 'message' | 'poll'): boolean {
    return this.pinnedId === id && this.pinnedType === type;
  }

  openPinMenu(item: ChatMessage | ChatPoll, type: 'message' | 'poll', event: MouseEvent) {
    if (!this.isOrganizer) return;
    event.stopPropagation();
    this.activePinId = item.id;
    this.activePinType = type;
  }

  closePinMenu() {
    this.activePinId = null;
    this.activePinType = null;
  }

  togglePinFromMenu(item: ChatMessage | ChatPoll, type: 'message' | 'poll', event: MouseEvent) {
    event.stopPropagation();
    this.togglePin(item, type);
    this.activePinId = null;
    this.activePinType = null;
  }

  togglePin(item: ChatMessage | ChatPoll, type: 'message' | 'poll') {
    if (this.pinnedId === item.id && this.pinnedType === type) {
      this.pinnedId = null;
      this.pinnedType = null;
      this.pinnedItem = null;
    } else {
      this.pinnedId = item.id;
      this.pinnedType = type;
      this.pinnedItem = item;
    }
    this.persistPinnedItem();
  }

  scrollToItem(id: number, type: 'message' | 'poll') {
    this.scrollToAnchor(this.getItemAnchorId(id, type));
  }

  scrollToAnchor(anchorId: string) {
    const container = this.messagesContainer?.nativeElement;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${anchorId}`);
    if (!target) return;
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    container.scrollTo({
      top: container.scrollTop + targetTop - containerTop - 12,
      behavior: 'smooth'
    });
  }

  getItemAnchorId(id: number, type: 'message' | 'poll'): string {
    return `chat-${type}-${id}`;
  }

  getMessageAnchorId(id: number): string {
    return this.getItemAnchorId(id, 'message');
  }

  loadBannedWords() {
    this.chatService.getBannedWords().subscribe({
      next: (words) => this.buildBannedPatterns(words),
      error: (err) => console.error('Error loading banned words', err)
    });
  }

  private loadData() {
    if (!this.currentUserId) return;

    this.chatService.getMessages(this.event.id).subscribe({
      next: (messages) => {
        if (messages.length === 0 && this.messages.length > 0) {
          return;
        }
        this.messages = messages;
        this.refreshPinnedItem();
        this.persistMessages();
        this.rebuildTimelineItems();
        this.scrollToBottom();
      },
      error: (err) => console.error('Error loading messages', err)
    });

    this.loadPolls();

    this.chatService.getMuteStatus(this.event.id, this.currentUserId).subscribe({
      next: (res) => (this.isMuted = res.muted),
      error: (err) => console.error('Error loading mute status', err)
    });

    if (this.isOrganizer) {
      this.chatService.getMutes(this.event.id, this.currentUserId).subscribe({
        next: (mutes) => {
          this.mutes = mutes;
          this.mutedUserIds = new Set(mutes.map(m => m.userId));
        },
        error: (err) => console.error('Error loading mutes', err)
      });
    }
  }

  private connectStream() {
    if (!this.currentUserId) return;
    this.eventSource?.close();
    this.eventSource = this.chatService.connect(this.event.id, this.currentUserId, (type, payload) => {
      if (type === 'message') {
        this.addMessage(payload as ChatMessage);
      }
      if (type === 'poll' || type === 'poll-vote' || type === 'poll-close') {
        this.upsertPoll(payload as ChatPoll);
      }
      if (type === 'mute') {
        const data = payload as { userId: number; muted: boolean };
        if (data.muted) {
          this.mutedUserIds.add(data.userId);
        } else {
          this.mutedUserIds.delete(data.userId);
        }
        if (this.currentUserId && Number(this.currentUserId) === data.userId) {
          this.isMuted = data.muted;
        }
      }
    });
  }

  private loadPolls() {
    if (!this.currentUserId) return;
    this.chatService.getPolls(this.event.id, this.currentUserId).subscribe({
      next: (polls) => {
        this.polls = polls;
        polls.forEach(poll => this.syncPollSelections(poll));
        this.rebuildTimelineItems();
        this.scrollToBottom();
      },
      error: (err) => console.error('Error loading polls', err)
    });
  }

  private toIsoLocal(input: string): string | null {
    if (!input) return null;
    if (input.includes('T')) return input;
    const trimmed = input.trim();
    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, dd, mm, yyyy, hh, min] = match;
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  private upsertPoll(updated: ChatPoll) {
    const existingIndex = this.polls.findIndex(p => p.id === updated.id);
    const isNew = existingIndex < 0;

    if (!isNew) {
      const next = [...this.polls];
      next[existingIndex] = updated;
      this.polls = next;
    } else {
      this.polls = [updated, ...this.polls];
    }

    this.syncPollSelections(updated);
    this.rebuildTimelineItems();

    if (isNew) {
      this.scrollToBottom();
    }
  }

  private syncPollSelections(poll: ChatPoll) {
    if (!this.currentUserId) return;
    const selection = new Set<number>();
    poll.options.forEach(option => {
      const hasVote = option.voters?.some(voter => voter.userId === Number(this.currentUserId));
      if (hasVote) {
        selection.add(option.id);
      }
    });
    this.pollSelections[poll.id] = selection;
  }

  private addMessage(message: ChatMessage) {
    if (!this.messages.some(existing => existing.id === message.id)) {
      this.messages = [...this.messages, message];
      this.refreshPinnedItem();
      this.persistMessages();
      this.rebuildTimelineItems();
      this.scrollToBottom();
    }
  }

  private initializeChat() {
    if (!this.event) return;
    this.messages = this.getCachedMessages();
    this.loadPinnedItem();
    this.buildInfoMessages();
    this.rebuildTimelineItems();
    this.activePinId = null;
    this.activePinType = null;
    this.loadBannedWords();
    if (!this.currentUserId) return;
    this.isOrganizer = this.event.creatorId?.toString() === this.currentUserId;
    this.loadData();
    this.connectStream();
  }

  private getCacheKeys(): string[] {
    if (!this.event?.id) return [];
    const keys = [`chat-cache:${this.event.id}`];
    if (this.currentUserId) {
      keys.push(`chat-cache:${this.event.id}:${this.currentUserId}`);
    }
    return keys;
  }

  private getCachedMessages(): ChatMessage[] {
    const keys = this.getCacheKeys();
    if (keys.length === 0) return [];
    const map = new Map<number, ChatMessage>();
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (!Array.isArray(parsed)) continue;
        parsed.forEach(message => {
          if (message && typeof message.id === 'number') {
            map.set(message.id, message);
          }
        });
      } catch {
        continue;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  private persistMessages() {
    const keys = this.getCacheKeys();
    if (keys.length === 0) return;
    const payload = JSON.stringify(this.messages);
    keys.forEach(key => localStorage.setItem(key, payload));
  }

  private pinnedStorageKey(): string | null {
    if (!this.event?.id) return null;
    return `chat-pins:${this.event.id}`;
  }

  private loadPinnedItem() {
    const key = this.pinnedStorageKey();
    if (!key) return;
    const raw = localStorage.getItem(key);
    if (!raw) {
      this.pinnedId = null;
      this.pinnedType = null;
      this.pinnedItem = null;
      return;
    }
    try {
      const parsed = JSON.parse(raw) as { id: number; type: 'message' | 'poll' };
      if (parsed && typeof parsed.id === 'number') {
        this.pinnedId = parsed.id;
        this.pinnedType = parsed.type;
        this.refreshPinnedItem();
      } else {
        this.pinnedId = null;
        this.pinnedType = null;
        this.pinnedItem = null;
      }
    } catch {
      this.pinnedId = null;
      this.pinnedType = null;
      this.pinnedItem = null;
    }
  }

  private persistPinnedItem() {
    const key = this.pinnedStorageKey();
    if (!key) return;
    if (this.pinnedId !== null && this.pinnedType !== null) {
      localStorage.setItem(key, JSON.stringify({ id: this.pinnedId, type: this.pinnedType }));
    } else {
      localStorage.removeItem(key);
    }
  }

  private refreshPinnedItem() {
    if (this.pinnedId === null || this.pinnedType === null) {
      this.pinnedItem = null;
      return;
    }
    if (this.pinnedType === 'message') {
      this.pinnedItem = this.messages.find(m => m.id === this.pinnedId) || null;
    } else {
      this.pinnedItem = this.polls.find(p => p.id === this.pinnedId) || null;
    }
  }

  private buildInfoMessages() {
    const info: Array<{
      key: 'time' | 'place' | 'link';
      label: string;
      content: string;
      anchorId: string;
      link?: string;
    }> = [];
    const time = this.formatEventTime();
    if (time) {
      info.push({
        key: 'time',
        label: 'Time',
        content: time,
        anchorId: 'chat-info-time'
      });
    }
    const place = this.formatEventPlace();
    if (place) {
      info.push({
        key: 'place',
        label: 'Location',
        content: place,
        anchorId: 'chat-info-place'
      });
    }
    const mapLink = this.getMapLink();
    if (mapLink) {
      info.push({
        key: 'link',
        label: 'Map Link',
        content: mapLink,
        anchorId: 'chat-info-link',
        link: mapLink
      });
    }
    this.infoMessages = info;
  }

  private formatEventTime(): string {
    if (!this.event) return '';
    const date = this.event.date ? new Date(`${this.event.date}T00:00:00`) : null;
    const start = this.event.startTime ? this.event.startTime.slice(0, 5) : '';
    const end = this.event.endTime ? this.event.endTime.slice(0, 5) : '';
    const datePart = date
      ? date.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short' })
      : '';
    const timePart = [start, end].filter(Boolean).join(' - ');
    return [datePart, timePart].filter(Boolean).join(' ');
  }

  private formatEventPlace(): string {
    if (!this.event) return '';
    if (this.event.city) return this.event.city;
    if (Number.isFinite(this.event.latitude) && Number.isFinite(this.event.longitude)) {
      return `${this.event.latitude.toFixed(5)}, ${this.event.longitude.toFixed(5)}`;
    }
    return '';
  }

  private getMapLink(): string {
    if (!this.event) return '';
    if (Number.isFinite(this.event.latitude) && Number.isFinite(this.event.longitude)) {
      return `https://www.google.com/maps/search/?api=1&query=${this.event.latitude},${this.event.longitude}`;
    }
    if (this.event.city) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.event.city)}`;
    }
    return '';
  }

  private scrollToBottom() {
    // Attende più frame per evitare layout incompleti.
    requestAnimationFrame(() => {
      this.doScrollToBottom();
      setTimeout(() => this.doScrollToBottom(), 50);
      setTimeout(() => this.doScrollToBottom(), 150);
    });
  }

  private doScrollToBottom() {
    const container = this.messagesContainer?.nativeElement;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  private buildBannedPatterns(words: string[]) {
    this.bannedPatterns = [];
    this.bannedRaw = [];
    if (!Array.isArray(words)) return;
    words.forEach(word => {
      const normalized = this.normalizeContent(word);
      if (!normalized) {
        if (word) this.bannedRaw.push(word);
        return;
      }
      this.bannedPatterns.push(this.buildPhrasePattern(normalized));
    });
  }

  private isBannedMessage(content: string): boolean {
    if (!content) return false;
    for (const raw of this.bannedRaw) {
      if (raw && content.includes(raw)) {
        return true;
      }
    }
    const normalized = this.normalizeContent(content);
    if (!normalized) return false;
    return this.bannedPatterns.some(pattern => pattern.test(normalized));
  }

  private normalizeContent(input: string): string {
    if (!input) return '';
    const lower = input.toLowerCase();
    const leet = this.replaceLeet(lower);
    const noDiacritics = leet.normalize('NFD').replace(/[\u0300-\u036f]+/g, '');
    const cleaned = noDiacritics.replace(/[^a-z0-9]+/g, ' ').trim();
    return cleaned.replace(/\s+/g, ' ');
  }

  private replaceLeet(input: string): string {
    const map: Record<string, string> = {
      '@': 'a',
      '0': 'o',
      '1': 'i',
      '!': 'i',
      '3': 'e',
      '4': 'a',
      '5': 's',
      '$': 's',
      '7': 't',
      '8': 'b'
    };
    return input
      .split('')
      .map(char => map[char] ?? char)
      .join('');
  }

  private buildPhrasePattern(normalizedPhrase: string): RegExp {
    const tokens = normalizedPhrase.split(/\s+/).filter(Boolean);
    const tokenPatterns = tokens.map(token => this.buildTokenPattern(token));
    const joined = tokenPatterns.join('\\s+');
    return new RegExp(`(?:^|\\s)${joined}(?:\\s|$)`);
  }

  private buildTokenPattern(token: string): string {
    return token
      .split('')
      .map(char => this.escapeRegex(char))
      .join('\\s*');
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
