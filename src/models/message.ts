export interface ParsedMessage {
  originalMessage: string;
  timestamp: string;
  amount: number;
  merchant: string | null;
  category: string;
  type: 'expense' | 'income' | 'unknown';
  source: string | null;
}

export interface MessageParseResponse {
  actionRequired: boolean;
  message: {
    id: number;
    content: string;
    createdAt: string;
  };
  transaction?: {
    id?: number;
    type: string;
    amount: number;
    merchant: string | null;
    category: string;
    timestamp: string;
  };
}