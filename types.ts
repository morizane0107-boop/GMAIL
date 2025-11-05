export interface Email {
  id: number;
  sender: string;
  subject: string;
  snippet: string;
}

export type InboxType = 'personal' | 'work' | 'shopping';
