import { ShieldCheck, Truck, Clock, Sparkles } from "lucide-react";

export const bundlingPackages = [
    {
        id: 1,
        title: "Couple Gateway",
        price: "Rp 450.000",
        description: "Perfect for couples seeking a romantic getaway in nature.",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800",
        features: ["2 Person Tent (Eiger)", "2 Sleeping Bags (Mummy)", "1 Portable Stove", "Cooking Set"]
    },
    {
        id: 2,
        title: "Family Adventure",
        price: "Rp 850.000",
        description: "Everything a family of 4 needs for a comfortable camping trip.",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800",
        features: ["4 Person Tent (Great Outdoor)", "4 Sleeping Bags", "Large Stove", "Full Kitchen Set", "4 Chairs"]
    },
    {
        id: 3,
        title: "Solo Explorer",
        price: "Rp 250.000",
        description: "Lightweight gear for the solo backpacker.",
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=800",
        features: ["1 Person Tent", "1 Sleeping Bag", "Mini Stove", "Headlamp"]
    }
];

export const bestSellers = [
    {
        id: 1,
        name: "Eiger Tent 4P",
        category: "Tents",
        price: "Rp 150.000/day",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "Deuter Aircontact",
        category: "Backpacks",
        price: "Rp 75.000/day",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Gas Portable",
        category: "Cooking",
        price: "Rp 25.000/day",
        image: "https://images.unsplash.com/photo-1583578768564-87779f428135?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        name: "Trekking Pole",
        category: "Accessories",
        price: "Rp 30.000/day",
        image: "https://images.unsplash.com/photo-1519414442781-fbd74543b371?auto=format&fit=crop&q=80&w=800"
    }
];

export const serviceBenefits = [
    {
        title: "Hygienic Guaranteed",
        description: "All equipment is thoroughly cleaned and sanitized after every use.",
        icon: Sparkles
    },
    {
        title: "Delivery Service",
        description: "We deliver the equipment straight to your doorstep or campsite.",
        icon: Truck
    },
    {
        title: "Quality Gear",
        description: "We only rent out branded and high-standard outdoor equipment.",
        icon: ShieldCheck
    },
    {
        title: "Flexible Duration",
        description: "Rent for a day, a weekend, or a week. Flexible return policies.",
        icon: Clock
    }
];

export const reviews = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Outdoor Enthusiast",
        rating: 5,
        comment: "The gear was in perfect condition! The delivery saved us so much time. Highly recommended for beginners.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Family Camper",
        rating: 5,
        comment: "The Family Adventure bundle was a lifesaver. We didn't have to buy anything, just rent and go!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 3,
        name: "Jessica Lee",
        role: "Solo Traveler",
        rating: 4,
        comment: "Great prices for high-end gear. The Deuter backpack was super comfortable.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    }
];

export const howItWorks = [
    {
        step: 1,
        title: "Choose Your Gear",
        description: "Browse our catalog and select the items or bundles you need."
    },
    {
        step: 2,
        title: "Book & Pay",
        description: "Select your dates and complete the secure payment process."
    },
    {
        step: 3,
        title: "Delivery / Pickup",
        description: "Get your gear delivered or pick it up at our store."
    },
    {
        step: 4,
        title: "Adventure Time",
        description: "Enjoy your trip! Return the gear when you're done."
    }
];
