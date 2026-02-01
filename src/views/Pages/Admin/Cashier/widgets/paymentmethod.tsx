import { X, ChevronDown } from "lucide-react";
import CalculatorCard from "./calculator";
import { BiMoney } from "react-icons/bi";

const PaymentModal = ({
  cart,
  show,
  onClose,
  customerName,
  setCustomerName,
  paymentAmount,
  setPaymentAmount,
  formatDate,
  formatTime,
  formatPrice,
  currentDate,
  getSubtotal,
  getTax,
  getDiscount,
  getTotal,
  getChange,
  getTotalItems,
  handleQuickAmount,
  handleNumberInput,
  onConfirmPayment,
}: any) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex">
          <div className="flex-1 p-4 border-r border-gray-200">
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-sm text-gray-700">Customer Info</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  Aa
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full font-medium text-sm bg-transparent border-none outline-none focus:bg-gray-50 px-1 py-1 rounded"
                  />
                  <div className="text-xs text-gray-500">{formatDate(currentDate)}</div>
                  <div className="text-xs text-gray-500">{formatTime(currentDate)}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 text-sm text-gray-700">Select a payment method</h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs">
                    <BiMoney color="green" size={24}/>
                  </div>
                  <span className="text-sm font-medium">Cash</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 text-sm text-gray-700">Transaction Details</h3>
              <div className="space-y-2 max-h-20 overflow-y-auto">
                {Object.values(cart).map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1 text-gray-800">{item.name}</span>
                    <span className="w-8 text-center text-gray-600">{item.quantity}x</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({getTotalItems()})</span>
                  <span className="text-gray-800">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-800">{formatPrice(getTax())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-500">-{formatPrice(getDiscount())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-gray-800">{formatPrice(parseFloat(paymentAmount) || 0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Change</span>
                  <span
                    className={`text-gray-800 ${getChange() < 0 ? "text-red-500" : "text-green-600"}`}
                  >
                    {formatPrice(Math.max(0, getChange()))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <CalculatorCard
            paymentAmount={paymentAmount}
            onQuickAmount={handleQuickAmount}
            onNumberInput={handleNumberInput}
            onPayNow={onConfirmPayment}
            isPayDisabled={!customerName || !paymentAmount || getChange() < 0}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
