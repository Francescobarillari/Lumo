export interface ChatPollVoter {
  userId: number;
  userName: string;
  userImage?: string;
}

export interface ChatPollOption {
  id: number;
  text: string;
  voters: ChatPollVoter[];
}

export interface ChatPoll {
  id: number;
  question: string;
  createdAt: string;
  endsAt: string;
  closed: boolean;
  options: ChatPollOption[];
}
