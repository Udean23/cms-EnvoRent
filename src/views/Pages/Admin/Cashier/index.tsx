import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import products from '@/core/dummy/productdummy';
import PaymentModal from './widgets/paymentmethod';
import ProductModal from './widgets/productvariantsmodal';

const Cashier = () => {
  const [cart, setCart] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', 'Clothing', 'Office', 'Sports', 'Shoes'];

  const addToCart = (product: any, variantIdx: number, size: any) => {
    const variant = product.variants[variantIdx];
    const key = `${product.id}-${variant.color}-${size.size}`;
    setCart((prev: any) => ({
      ...prev,
      [key]: {
        ...product,
        variant: variant,
        size: size.size,
        color: variant.color,
        quantity: (prev[key]?.quantity || 0) + 1,
        price: product.price,
      },
    }));
  };

  const removeFromCart = (key: string) => {
    setCart((prev: any) => {
      const newCart = { ...prev };
      if (newCart[key]) {
        if (newCart[key].quantity > 1) {
          newCart[key].quantity -= 1;
        } else {
          delete newCart[key];
        }
      }
      return newCart;
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum: any, item: any) => sum + item.quantity, 0);
  const getSubtotal = (): number => Object.values(cart).reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const getTax = () => Math.round(getSubtotal() * 0.1);
  const getDiscount = () => Math.round(getSubtotal() * 0.05);
  const getTotal = () => getSubtotal() + getTax() - getDiscount();
  const getChange = () => (parseFloat(paymentAmount) || 0) - getTotal();

  const formatPrice = (price: number) => `Rp${price.toLocaleString('id-ID')}`;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleQuickAmount = (amount: number) => {
    setPaymentAmount((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + amount).toString();
    });
  };

  const handleNumberInput = (num: string) => {
    if (num === 'clear') setPaymentAmount('');
    else if (num === 'delete') setPaymentAmount((prev) => prev.slice(0, -1));
    else setPaymentAmount((prev) => prev + num);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const filteredProducts = products
    .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const openProductModal = (product: any) => {
    setModalProduct(product);
    setSelectedVariantIdx(0);
    setSelectedSize(null);
    setShowProductModal(true);
  };

  const handleAddToCartFromModal = () => {
    if (modalProduct && selectedSize) {
      addToCart(modalProduct, selectedVariantIdx, selectedSize);
      setShowProductModal(false);
    }
  };

  return (
    <div className="flex bg-gray-100 rounded-2xl">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Choose Products</h1>
        <div className="relative mb-4 bg-white">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => { setSelectedCategory(category); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductModal(product)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
              style={{ minHeight: 280 }}
            >
              <div className="w-full h-32 mb-3 rounded-lg bg-orange-100 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || '/default.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-gray-800 mb-1 text-sm leading-tight">{product.name}</h3>
              <div className="text-xs text-gray-500 mb-1">Code: {product.id}</div>
              <div className="text-xs text-gray-500 mb-2">Available: {product.variants?.[0]?.sizes?.reduce((a: number, b: any) => a + b.stock, 0) || 0}</div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-gray-800">{formatPrice(product.price)}</span>
                <span className="text-gray-400 text-xl">*</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-6 pb-15 gap-2 ">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white'}`}
          >
            Prev
          </button>
          <span className="text-sm font-medium">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="w-96 bg-white border-l border-gray-200 flex max-h-[100vh] flex-col max-w-100">
          <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Cart</h2>
            <div className="space-y-3 min-h-60 max-h-60 overflow-auto">
              <div className="p-2">
                {Object.entries(cart).map(([key, item]: [string, any]) => (
                  <div key={key} className="relative flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-2">
                    <button
                      onClick={() => removeFromCart(key)}
                      className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg border">
                        <img
                          src={item.variant?.images?.[0] || item.image || '/default.png'}
                          alt={item.name}
                          className="h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-400">{item.color} / {item.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {Object.values(cart).length >= 0 && (
              <div className="border-t border-gray-200 mt-6 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-semibold">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(getTax())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500 font-semibold">-{formatPrice(getDiscount())}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total Amount</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>
                <button
                  onClick={handlePayNow}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition-colors"
                >
                  Payment Process
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        customerName={customerName}
        setCustomerName={setCustomerName}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        formatDate={formatDate}
        formatTime={formatTime}
        formatPrice={formatPrice}
        currentDate={currentDate}
        getSubtotal={getSubtotal}
        getTax={getTax}
        getDiscount={getDiscount}
        getTotal={getTotal}
        getChange={getChange}
        getTotalItems={getTotalItems}
        handleQuickAmount={handleQuickAmount}
        handleNumberInput={handleNumberInput}
        onConfirmPayment={() => {
          alert(`Payment processed for ${customerName}, change: ${formatPrice(getChange())}`);
          setCart({});
          setPaymentAmount('');
          setCustomerName('');
          setShowPaymentModal(false);
        }}
      />

      <ProductModal
        show={showProductModal}
        product={modalProduct}
        selectedVariantIdx={selectedVariantIdx}
        setSelectedVariantIdx={setSelectedVariantIdx}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        onClose={() => setShowProductModal(false)}
        onAddToCart={handleAddToCartFromModal}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default Cashier;