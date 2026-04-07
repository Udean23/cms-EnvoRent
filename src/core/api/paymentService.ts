import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface CreateInvoicePayload {
  transaction_id: number;
  amount_paid: number;
  payment_for: 'booking' | 'fine';
  customer_email: string;
  customer_name: string;
}

interface VirtualAccountPayload extends CreateInvoicePayload {
  bank_code: 'BCA' | 'BNI' | 'MANDIRI' | 'BRI';
}

interface PaymentResponse {
  message: string;
  payment_url?: string;
  payment: Record<string, any>;
  invoice_id?: string;
  virtual_account_number?: string;
  bank_code?: string;
  va_id?: string;
}

interface PaymentStatusResponse {
  payment: Record<string, any>;
  xendit_status: string;
}

export const paymentService = {
  /**
   * Buat invoice untuk pembayaran (credit card & multiple methods)
   */
  createInvoice: async (data: CreateInvoicePayload): Promise<PaymentResponse> => {
    try {
      const response = await axios.post<PaymentResponse>(
        `${API_BASE_URL}/payments/invoice`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  },

  /**
   * Buat virtual account untuk bank transfer
   */
  createVirtualAccount: async (data: VirtualAccountPayload): Promise<PaymentResponse> => {
    try {
      const response = await axios.post<PaymentResponse>(
        `${API_BASE_URL}/payments/virtual-account`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create virtual account:', error);
      throw error;
    }
  },

  /**
   * Cek status pembayaran
   */
  getPaymentStatus: async (transactionId: number): Promise<PaymentStatusResponse> => {
    try {
      const response = await axios.get<PaymentStatusResponse>(
        `${API_BASE_URL}/payments/status/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  },

  /**
   * Credit card payment (redirect to invoice)
   */
  creditCardPayment: async (data: CreateInvoicePayload): Promise<PaymentResponse> => {
    return paymentService.createInvoice(data);
  },
};

// ============================================
// CONTOH PENGGUNAAN DI COMPONENT
// ============================================

/*
// PaymentModal.tsx
import { useState } from 'react';
import { paymentService } from '@/core/api/paymentService';

export function PaymentModal({ transactionId, amount, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'invoice' | 'va'>('invoice');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        transaction_id: transactionId,
        amount_paid: amount,
        payment_for: 'booking' as const,
        customer_email: 'customer@example.com',
        customer_name: 'John Doe',
      };

      let response;
      if (paymentMethod === 'invoice') {
        response = await paymentService.createInvoice(payload);
      } else {
        response = await paymentService.createVirtualAccount({
          ...payload,
          bank_code: 'BCA',
        });
      }

      // Redirect ke payment URL
      if (response.payment_url) {
        window.open(response.payment_url, '_blank');
      } else if (response.virtual_account_number) {
        // Tampilkan nomor VA
        alert(`Virtual Account: ${response.virtual_account_number}`);
      }

      onSuccess(response);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
        <option value="invoice">Credit Card / e-Wallet</option>
        <option value="va">Bank Transfer</option>
      </select>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Bayar Sekarang'}
      </button>
    </div>
  );
}
*/

/*
// Polling untuk cek status pembayaran
async function pollPaymentStatus(transactionId: number) {
  const maxAttempts = 30; // 30 attempts = 5 minutes dengan interval 10 detik
  let attempts = 0;

  const pollInterval = setInterval(async () => {
    try {
      const status = await paymentService.getPaymentStatus(transactionId);
      
      if (status.xendit_status === 'PAID') {
        console.log('Payment berhasil!');
        clearInterval(pollInterval);
        // Do something after payment
      } else if (status.xendit_status === 'EXPIRED') {
        console.log('Invoice expired');
        clearInterval(pollInterval);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
      }
    } catch (error) {
      console.error('Error polling status:', error);
    }
  }, 10000); // Poll every 10 seconds
}
*/
