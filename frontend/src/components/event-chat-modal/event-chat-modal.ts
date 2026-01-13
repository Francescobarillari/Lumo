import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';
import { ChatPoll, ChatPollOption } from '../../models/chat-poll';
import { ChatMute } from '../../models/chat-mute';
import { Event as LumoEvent } from '../../models/event';
import { User } from '../../models/user';

@Component({
  selector: 'event-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './event-chat-modal.html',
  styleUrl: './event-chat-modal.css'
})
export class EventChatModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() event!: LumoEvent;
  @Input() currentUserId: string | null = null;
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
  pollOptionsText = '';
  pollEndsAt = '';
  pollSelections: Record<number, Set<number>> = {};
  pollError = '';
  showPollPopup = false;
  pinnedMessageId: number | null = null;
  pinnedMessage: ChatMessage | null = null;
  activePinMessageId: number | null = null;
  bannedPatterns: RegExp[] = [];
  bannedRaw: string[] = [];
  messageError = '';
  infoMessages: Array<{
    key: 'time' | 'place' | 'rules' | 'link';
    label: string;
    content: string;
    anchorId: string;
    link?: string;
  }> = [];

  private eventSource: EventSource | null = null;

  constructor(private chatService: ChatService) { }

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
    this.pollError = '';
    this.showPollPopup = true;
  }

  closePollPopup() {
    this.showPollPopup = false;
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
        this.messageError = 'Messaggio non consentito.';
        console.error('Error checking message', err);
      }
    });
  }

  createPoll() {
    if (!this.currentUserId || !this.pollQuestion.trim()) return;
    const options = this.pollOptionsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    if (options.length < 2) {
      this.pollError = 'Inserisci almeno due opzioni.';
      return;
    }
    if (!this.pollEndsAt) {
      this.pollError = 'Seleziona una data di fine.';
      return;
    }
    const endsAtIso = this.toIsoLocal(this.pollEndsAt);
    if (!endsAtIso) {
      this.pollError = 'Data fine non valida.';
      return;
    }

    this.chatService.createPoll(this.event.id, this.currentUserId, this.pollQuestion.trim(), options, endsAtIso)
      .subscribe({
        next: (poll) => {
          this.upsertPoll(poll);
          this.pollQuestion = '';
          this.pollOptionsText = '';
          this.pollEndsAt = '';
          this.showPollPopup = false;
          this.pollError = '';
          this.loadPolls();
        },
        error: (err) => {
          console.error('Error creating poll', err);
          this.pollError = 'Errore nella creazione del sondaggio.';
        }
      });
  }

  toggleVote(poll: ChatPoll, optionId: number) {
    if (poll.closed) return;
    const selection = this.pollSelections[poll.id] || new Set<number>();
    if (selection.has(optionId)) {
      selection.delete(optionId);
    } else {
      selection.add(optionId);
    }
    this.pollSelections[poll.id] = selection;
  }

  submitVote(poll: ChatPoll) {
    if (!this.currentUserId || poll.closed) return;
    const selection = this.pollSelections[poll.id] || new Set<number>();
    const optionIds = Array.from(selection);
    this.chatService.votePoll(this.event.id, poll.id, this.currentUserId, optionIds).subscribe({
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

  getTimelineItems(): Array<{ type: 'message' | 'poll'; createdAt: string; message?: ChatMessage; poll?: ChatPoll }> {
    const items: Array<{ type: 'message' | 'poll'; createdAt: string; message?: ChatMessage; poll?: ChatPoll }> = [];
    this.messages.forEach(message => items.push({ type: 'message', createdAt: message.createdAt, message }));
    this.polls.forEach(poll => items.push({ type: 'poll', createdAt: poll.createdAt, poll }));
    return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

  isPinned(messageId: number): boolean {
    return this.pinnedMessageId === messageId;
  }

  openPinMenu(message: ChatMessage, event: MouseEvent) {
    if (!this.isOrganizer) return;
    event.stopPropagation();
    this.activePinMessageId = message.id;
  }

  closePinMenu() {
    this.activePinMessageId = null;
  }

  togglePinFromMenu(message: ChatMessage, event: MouseEvent) {
    event.stopPropagation();
    this.togglePin(message);
    this.activePinMessageId = null;
  }

  togglePin(message: ChatMessage) {
    if (this.pinnedMessageId === message.id) {
      this.pinnedMessageId = null;
      this.pinnedMessage = null;
    } else {
      this.pinnedMessageId = message.id;
      this.pinnedMessage = message;
    }
    this.persistPinnedMessage();
  }

  scrollToMessage(messageId: number) {
    this.scrollToAnchor(this.getMessageAnchorId(messageId));
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

  getMessageAnchorId(messageId: number): string {
    return `chat-message-${messageId}`;
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
        this.refreshPinnedMessage();
        this.persistMessages();
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
    if (existingIndex >= 0) {
      const next = [...this.polls];
      next[existingIndex] = updated;
      this.polls = next;
    } else {
      this.polls = [updated, ...this.polls];
    }
    this.syncPollSelections(updated);
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
      this.refreshPinnedMessage();
      this.persistMessages();
      this.scrollToBottom();
    }
  }

  private initializeChat() {
    if (!this.event) return;
    this.messages = this.getCachedMessages();
    this.loadPinnedMessage();
    this.buildInfoMessages();
    this.activePinMessageId = null;
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

  private loadPinnedMessage() {
    const key = this.pinnedStorageKey();
    if (!key) return;
    const raw = localStorage.getItem(key);
    if (!raw) {
      this.pinnedMessageId = null;
      this.pinnedMessage = null;
      return;
    }
    try {
      const parsed = JSON.parse(raw) as number;
      if (typeof parsed === 'number') {
        this.pinnedMessageId = parsed;
        this.refreshPinnedMessage();
      } else {
        this.pinnedMessageId = null;
        this.pinnedMessage = null;
      }
    } catch {
      this.pinnedMessageId = null;
      this.pinnedMessage = null;
    }
  }

  private persistPinnedMessage() {
    const key = this.pinnedStorageKey();
    if (!key) return;
    if (this.pinnedMessageId !== null) {
      localStorage.setItem(key, JSON.stringify(this.pinnedMessageId));
    } else {
      localStorage.removeItem(key);
    }
  }

  private refreshPinnedMessage() {
    if (this.pinnedMessageId === null) {
      this.pinnedMessage = null;
      return;
    }
    this.pinnedMessage = this.messages.find(m => m.id === this.pinnedMessageId) || null;
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
    requestAnimationFrame(() => {
      const container = this.messagesContainer?.nativeElement;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    });
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
