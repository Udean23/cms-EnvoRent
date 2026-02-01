import React, { useState } from 'react';
import { Menu, X, Tent, Calendar, Users, ArrowRight, Instagram, Facebook, Twitter, Star, ChevronRight, ShoppingCart } from 'lucide-react';
import { bundlingPackages, bestSellers, serviceBenefits, howItWorks, reviews } from '../dummy/landingPageData';
import { useCartStore } from '@/core/store/useCartStore';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.items.length);

  return (
    <div className="font-sans text-stone-800 bg-stone-50">
      <nav className="fixed w-full z-50 bg-stone-900/90 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="../../../../../public/envolvemini.png" className='w-10 h-10' />
              <span className="font-serif text-2xl tracking-wide">EnvoRent</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link to="/catalogue" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Catalogue</Link>
                <a href="#bundling" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Packages</a>
                <a href="#reviews" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Reviews</a>

                <Link to="/cart" className="p-2 hover:bg-stone-800 rounded-full">
                  <ShoppingCart className="w-5 h-5 transform translate-y-2.75" />
                  {cartItemCount > 0 && (
                    <span className="absolute inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white transform translate-x-4 -translate-y-4 bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link to="/catalogue" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                  Rent Now
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative p-2 hover:bg-stone-800 rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-stone-800"
                >
                  {mobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-emerald-400">Home</Link>
              <Link to="/catalogue" className="block px-3 py-2 rounded-md text-base font-medium hover:text-emerald-400">Catalogue</Link>
              <a href="#bundling" className="block px-3 py-2 rounded-md text-base font-medium hover:text-emerald-400">Packages</a>
              <Link to="/catalogue" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium block text-center">
                Rent Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000"
            alt="Camping Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <p className="text-emerald-400 font-medium tracking-widest mb-4 uppercase text-sm md:text-base">Premium Outdoor Gear Rental</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            RENT PREMIUM GEAR, <br />
            <span className="italic text-emerald-200">EXPLORE NATURE FREEDOM!</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-10 text-stone-200">
            Don't let expensive gear hold you back. Rent top-quality camping equipment from us and start your adventure today. Clean, easy, and affordable.
          </p>
        </div>

        {/* <div className="absolute bottom-[-3rem] left-0 right-0 z-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Pick-up Date</label>
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <input type="date" className="w-full text-sm outline-none bg-transparent text-stone-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Return Date</label>
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <input type="date" className="w-full text-sm outline-none bg-transparent text-stone-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Group Size</label>
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <select className="w-full text-sm outline-none bg-transparent">
                  <option>2 People</option>
                  <option>4 People</option>
                  <option>6+ People</option>
                </select>
              </div>
            </div>
            <button className="bg-emerald-800 hover:bg-emerald-900 text-white h-10 rounded-md font-medium transition-colors">
              Find Gear
            </button>
          </div>
        </div> */}
      </section>

      <section className="py-24 px-4 bg-stone-50 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Why Choose EnvoRent</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">We Make Camping Easy</h2>
          <p className="mt-4 max-w-2xl mx-auto text-stone-600 leading-relaxed">
            Forget the hassle of buying, storing, and maintaining gear. We provide everything you need for a perfect outdoor getaway.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">{benefit.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50 skew-x-12 translate-x-20 z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Simple Process</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-serif text-emerald-100 absolute -top-8 -left-4 z-0 font-bold">{item.step}</div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm">{item.description}</p>
                </div>
                {index !== howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 text-emerald-200">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bundling" className="py-20 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Value Deals</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Bundling Packages</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium mt-4 md:mt-0">
              View All Bundles <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundlingPackages.map((pack) => (
              <div key={pack.id} className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
                <div className="h-56 overflow-hidden relative">
                  <img src={pack.image} alt={pack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
                    BEST VALUE
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{pack.title}</h3>
                  <p className="text-stone-500 text-xs mb-4">{pack.description}</p>
                  <div className="text-emerald-700 font-bold text-2xl mb-4">{pack.price}</div>

                  <div className="flex-1">
                    <ul className="space-y-2 mb-6">
                      {pack.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full py-3 bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bestseller" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Customers' Favorites</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Best Seller Items</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((item) => (
              <div key={item.id} className="bg-stone-50 rounded-lg p-4 hover:shadow-lg transition-shadow border border-transparent hover:border-emerald-100">
                <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-white relative group flex items-center justify-center p-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-bold uppercase mb-1">{item.category}</div>
                  <h3 className="font-bold text-stone-900 text-lg leading-tight">{item.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-stone-700 font-medium">{item.price}</span>
                    <button className="w-9 h-9 rounded-full bg-white border border-stone-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border-2 border-emerald-600 text-emerald-700 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-colors">
              View Full Catalog
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">High-quality gear, affordable prices, and unforgettable memories await. Book your equipment now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-transform hover:scale-105">
              Rent Equipment Now
            </button>
            <button className="bg-transparent border border-white hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-4 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Testimonials</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">What Adventurers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 italic mb-8 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-stone-900">{review.name}</div>
                    <div className="text-xs text-stone-500 uppercase">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-emerald-200/80 mb-8">Get the latest gear updates, rental discounts, and camping tips directly to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-emerald-900/50 border border-emerald-800 rounded-lg px-4 py-3 text-white placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-bold mb-4 text-emerald-400">Services</h4>
              <ul className="space-y-3 text-emerald-200/70">
                <li><a href="#" className="hover:text-white transition-colors">Tent Rental</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hiking Gear</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cooking Faciliites</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Equipment</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-emerald-400">Contact</h4>
              <ul className="space-y-3 text-emerald-200/70">
                <li>hello@envorent.com</li>
                <li>+62 812 3456 7890</li>
                <li>Bandung, West Java, Indonesia</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-600">
          <p>&copy; 2024 EnvoRent. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
      </section>
    </div>
  );
}