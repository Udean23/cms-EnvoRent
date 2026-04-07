import axios from 'axios';
import { getToken } from '../helpers/TokenHandle';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface SendMessagePayload {
  message: string;
}

interface MessageData {
  id: number;
  sender_id: number;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ConversationData {
  id: number;
  other_user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  latest_message?: MessageData;
  last_message_at?: string;
}

interface ConversationDetailData {
  conversation: {
    id: number;
    other_user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  messages: MessageData[];
}

const getAuthHeader = () => {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

export const chatService = {
  /**
   * Get all conversations for the current user
   */
  getAllConversations: async (): Promise<{ data: ConversationData[] }> => {
    try {
      const response = await axios.get<{ data: ConversationData[] }>(
        `${API_BASE_URL}/conversations`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  },

  /**
   * Get or create a conversation with a specific user
   */
  getOrCreateConversation: async (userId: number): Promise<{ id: number }> => {
    try {
      const response = await axios.post<{ id: number }>(
        `${API_BASE_URL}/conversations/user/${userId}`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get or create conversation:', error);
      throw error;
    }
  },

  /**
   * Get conversation details with all messages
   */
  getConversationDetails: async (conversationId: number): Promise<ConversationDetailData> => {
    try {
      const response = await axios.get<ConversationDetailData>(
        `${API_BASE_URL}/conversations/${conversationId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get conversation details:', error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: async (conversationId: number, payload: SendMessagePayload): Promise<MessageData> => {
    try {
      const response = await axios.post<MessageData>(
        `${API_BASE_URL}/conversations/${conversationId}/messages`,
        payload,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  /**
   * Mark a message as read
   */
  markMessageAsRead: async (messageId: number): Promise<{ success: boolean }> => {
    try {
      const response = await axios.put<{ success: boolean }>(
        `${API_BASE_URL}/messages/${messageId}/read`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  },

  /**
   * Mark all messages in a conversation as read
   */
  markConversationAsRead: async (conversationId: number): Promise<{ success: boolean }> => {
    try {
      const response = await axios.put<{ success: boolean }>(
        `${API_BASE_URL}/conversations/${conversationId}/read-all`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
      throw error;
    }
  },
};
