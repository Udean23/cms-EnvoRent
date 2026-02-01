export const categories = [
    { id: 'all', name: 'All Gear' },
    { id: 'tents', name: 'Tents & Shelter' },
    { id: 'sleeping', name: 'Sleeping Gear' },
    { id: 'cooking', name: 'Cooking & Fire' },
    { id: 'backpacks', name: 'Backpacks' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'accessories', name: 'Accessories' }
];

export const products = [
    {
        id: 1,
        name: "Eiger Tent 4P",
        category: "tents",
        price: 150000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800",
        description: "Spacious 4-person tent, waterproof and wind resistant."
    },
    {
        id: 2,
        name: "Deuter Aircontact 65+10",
        category: "backpacks",
        price: 75000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        description: "Heavy duty carrier for long expeditions."
    },
    {
        id: 3,
        name: "Portable Gas Stove",
        category: "cooking",
        price: 25000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1583578768564-87779f428135?auto=format&fit=crop&q=80&w=800",
        description: "Compact stove for outdoor cooking. Gas canister not included."
    },
    {
        id: 4,
        name: "Trekking Pole Carbon",
        category: "accessories",
        price: 30000,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1519414442781-fbd74543b371?auto=format&fit=crop&q=80&w=800",
        description: "Lightweight carbon fiber poles for stability."
    },
    {
        id: 5,
        name: "Mummy Sleeping Bag",
        category: "sleeping",
        price: 35000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1626248982348-1b20e090df48?auto=format&fit=crop&q=80&w=800",
        description: "Comfort temperature 5°C, keeps you warm in mountains."
    },
    {
        id: 6,
        name: "LED Headlamp",
        category: "lighting",
        price: 15000,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1563299796-b729d0af54a5?auto=format&fit=crop&q=80&w=800",
        description: "High lumens headlamp with multiple modes."
    },
    {
        id: 7,
        name: "Camping Chair",
        category: "accessories",
        price: 20000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?auto=format&fit=crop&q=80&w=800",
        description: "Foldable chair with cup holder."
    }
];

export const bundles = [
    {
        id: 101,
        name: "Couple Gateway",
        price: 450000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800",
        features: ["2 Person Tent", "2 Sleeping Bags", "1 Portable Stove", "Cooking Set"],
        description: "Perfect for couples seeking a romantic getaway in nature."
    },
    {
        id: 102,
        name: "Family Adventure",
        price: 850000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800",
        features: ["4 Person Tent", "4 Sleeping Bags", "Large Stove", "Full Kitchen Set", "Hammock"],
        description: "Everything a family of 4 needs for a comfortable camping trip."
    },
    {
        id: 103,
        name: "Solo Explorer",
        price: 250000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=800",
        features: ["1 Person Tent", "1 Sleeping Bag", "Mini Stove", "Headlamp"],
        description: "Lightweight gear for the solo backpacker."
    }
];
