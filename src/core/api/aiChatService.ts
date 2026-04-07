import axios from 'axios';
import { getToken } from '../helpers/TokenHandle';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface SendMessagePayload {
  message: string;
}

interface MessageData {
  id: number;
  sender: string;
  message: string;
  created_at: string;
}

const getAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const aiChatService = {
  sendMessage: async (payload: SendMessagePayload): Promise<MessageData> => {
    const response = await axios.post(`${API_BASE_URL}/ai-chat/send-message`, payload, getAuthHeader());
    return {
      id: Date.now(), // Temporary ID
      sender: response.data.sender,
      message: response.data.message,
      created_at: new Date().toISOString(),
    };
  },
};

export { aiChatService };