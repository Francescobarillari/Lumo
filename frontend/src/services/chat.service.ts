import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import { ChatMute } from '../models/chat-mute';
import { ChatPoll } from '../models/chat-poll';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://localhost:8080/api/events';
  private moderationUrl = 'http://localhost:8080/api/moderation';

  constructor(private http: HttpClient) { }

  getMessages(eventId: number, userId?: string | number, limit = 100): Observable<ChatMessage[]> {
    const params = new URLSearchParams();
    if (userId !== undefined && userId !== null) {
      params.set('userId', String(userId));
    }
    params.set('limit', String(limit));
    return this.http.get<ChatMessage[]>(
      `${this.baseUrl}/${eventId}/chat/messages?${params.toString()}`
    );
  }

  sendMessage(eventId: number, userId: string | number, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(
      `${this.baseUrl}/${eventId}/chat/messages?userId=${userId}`,
      { content }
    );
  }

  connect(eventId: number, userId: string | number, onEvent: (type: string, payload: any) => void): EventSource {
    const source = new EventSource(`${this.baseUrl}/${eventId}/chat/stream?userId=${userId}`);
    const handler = (type: string) => (event: MessageEvent) => {
      onEvent(type, JSON.parse(event.data));
    };
    source.addEventListener('message', handler('message'));
    source.addEventListener('poll', handler('poll'));
    source.addEventListener('poll-vote', handler('poll-vote'));
    source.addEventListener('poll-close', handler('poll-close'));
    source.addEventListener('mute', handler('mute'));
    return source;
  }

  getMuteStatus(eventId: number, userId: string | number): Observable<{ muted: boolean }> {
    return this.http.get<{ muted: boolean }>(
      `${this.baseUrl}/${eventId}/chat/mute-status?userId=${userId}`
    );
  }

  getMutes(eventId: number, userId: string | number): Observable<ChatMute[]> {
    return this.http.get<ChatMute[]>(
      `${this.baseUrl}/${eventId}/chat/mutes?userId=${userId}`
    );
  }

  muteUser(eventId: number, userId: string | number, targetUserId: number, reason?: string | null): Observable<ChatMute> {
    return this.http.post<ChatMute>(
      `${this.baseUrl}/${eventId}/chat/mutes?userId=${userId}`,
      { targetUserId, reason }
    );
  }

  unmuteUser(eventId: number, userId: string | number, targetUserId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${eventId}/chat/mutes/${targetUserId}?userId=${userId}`
    );
  }

  getPolls(eventId: number, userId: string | number): Observable<ChatPoll[]> {
    return this.http.get<ChatPoll[]>(
      `${this.baseUrl}/${eventId}/chat/polls?userId=${userId}`
    );
  }

  createPoll(eventId: number, userId: string | number, question: string, options: string[], endsAt: string): Observable<ChatPoll> {
    return this.http.post<ChatPoll>(
      `${this.baseUrl}/${eventId}/chat/polls/open?userId=${userId}`,
      { question, options, endsAt }
    );
  }

  votePoll(eventId: number, pollId: number, userId: string | number, optionIds: number[]): Observable<ChatPoll> {
    return this.http.post<ChatPoll>(
      `${this.baseUrl}/${eventId}/chat/polls/${pollId}/votes?userId=${userId}`,
      { optionIds }
    );
  }

  closePoll(eventId: number, pollId: number, userId: string | number): Observable<ChatPoll> {
    return this.http.post<ChatPoll>(
      `${this.baseUrl}/${eventId}/chat/polls/${pollId}/close?userId=${userId}`,
      {}
    );
  }

  getBannedWords(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.moderationUrl}/banned-words`
    );
  }

  checkMessage(content: string): Observable<{ banned: boolean }> {
    return this.http.post<{ banned: boolean }>(
      `${this.moderationUrl}/check`,
      { content }
    );
  }
}
