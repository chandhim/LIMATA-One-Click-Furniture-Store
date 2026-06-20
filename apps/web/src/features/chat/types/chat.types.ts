export type Conversation = {
  conversationId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  customer?: {
    userId: string;
    name: string;
    email: string;
  } | null;
};

export type Message = {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

export type StartConversationResponse = {
  conversation: Conversation;
};

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export type GetConversationResponse = {
  conversation: Conversation;
};

export type GetMessagesResponse = {
  messages: Message[];
};

export type SendMessagePayload = {
  conversationId: string;
  content: string;
};
