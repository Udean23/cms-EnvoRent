import React from "react";
import axios from "axios";

declare global {
  interface Window {
    snap: any;
  }
}

const CheckoutPage: React.FC = () => {
  const checkout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/payments/checkout",
        {
          transaction_id: 7
        },
        {
          headers: {
            Authorization: `Bearer 4|XIMMiRgzpYGVwS85IHfDjZZSNAiEyg4IZTaut0NN18eecb81`,
            Accept: "application/json"
          }
        }
      );

      window.snap.pay(response.data.snap_token, {
        onSuccess: (result: any) => {
          console.log("SUCCESS", result);
          alert("Payment success");
        },
        onPending: (result: any) => {
          console.log("PENDING", result);
          alert("Waiting for payment");
        },
        onError: (result: any) => {
          console.log("ERROR", result);
          alert("Payment failed");
        },
        onClose: () => {
          alert("Popup closed");
        }
      });
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Checkout</h2>

      <button
        onClick={checkout}
        style={{
          padding: "12px 18px",
          backgroundColor: "#2563eb",
          color: "#fff",
          borderRadius: 6,
          border: "none",
          cursor: "pointer"
        }}
      >
        Pay with Midtrans
      </button>
    </div>
  );
};

export default CheckoutPage;
