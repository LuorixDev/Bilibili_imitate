export interface LiveStream {
  id: string;
  title: string;
  cover: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  viewers: number;
  tags: string[];
  src: string;
  startedAt: string;
}

export interface LiveChatMessage {
  id: string;
  liveId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}
