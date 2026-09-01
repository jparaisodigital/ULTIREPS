window.CONFIG = {
    // Store Metadata
    storeName: "Ulti",
    currency: "₱",
    
    // Google Sheets CSV Export URL (Mag-publish sa web as CSV ang Google Sheet tapos ilagay rito ang link)
    googleSheetCSV: "YOUR_GOOGLE_SHEET_CSV_URL_HERE",
    
    // Sa loob ng iyong config object sa config.js
    heroImagesDesktop: [
        "assets/hero.png",
        "assets/hero1.png",
        "assets/hero2.png"
    ],
    heroImagesMobile: [
        "assets/mobile1.png",
        "assets/mobile2.png",
        "assets/mobile3.png"
    ],
    
    // Logo (PNG or SVG with transparent background recommended)
    logo: "assets/logo.png",          
    logoWhite: "assets/logo-white.png", 
    
    // Social Media Links
    socials: {
        facebook: "https://www.facebook.com/profile.php?id=61551038027330",
        instagram: "https://www.instagram.com/ultireps.ph/",
        tiktok: "https://tiktok.com/@YOUR_PAGE",
        messenger: "https://m.me/61551038027330"
    },
    
    // Idagdag sa loob ng iyong config object sa config.js
    products: [
        {
            id: 1,
            name: "Nike Mind 001 | Black Chrome",
            price: 3495,
            category: "NIKE",
            hot: true,
            image_url: "products/1 (1).png",
            images: ["products/1 (1).png", "products/nike-1-2.jpg", "products/nike-1-3.jpg", "products/nike-1-4.jpg", "products/nike-1-5.jpg"]
        },
        {
            id: 2,
            name: "Nike Mind 001 | Solar Red ",
            price: 3495,
            category: "NIKE",
            hot: true,
            image_url: "products/1 (2).png",
            images: ["products/1 (2).png", "products/nike-2-2.jpg", "products/nike-2-3.jpg", "products/nike-2-4.jpg", "products/nike-2-5.jpg"]
        },
        {
            id: 3,
            name: "SAMPLE",
            price: 999,
            category: "NIKE",
            hot: true,
            image_url: "products/1 (3).png",
            images: ["products/1 (3).png", "products/nike-3-2.jpg", "products/nike-3-3.jpg", "products/nike-3-4.jpg", "products/nike-3-5.jpg"]
        },
        {
            id: 4,
            name: "SAMPLE",
            price: 999,
            category: "NIKE",
            hot: false,
            image_url: "products/1 (4).png",
            images: ["products/1 (4).png", "products/nike-4-2.jpg", "products/nike-4-3.jpg", "products/nike-4-4.jpg", "products/nike-4-5.jpg"]
        },
        {
            id: 5,
            name: "SAMPLE",
            price: 999,
            category: "CLASS",
            hot: true,
            image_url: "products/1 (5).png",
            images: ["products/1 (5).png", "products/mind-1-2.jpg", "products/mind-1-3.jpg", "products/mind-1-4.jpg", "products/mind-1-5.jpg"]
        },
        {
            id: 6,
            name: "Nike Mind 001 | Team Red",
            price: 3495,
            category: "CLASS",
            hot: false,
            image_url: "products/1 (6).png",
            images: ["products/1 (6).png", "products/mind-2-2.jpg", "products/mind-2-3.jpg", "products/mind-2-4.jpg", "products/mind-2-5.jpg"]
        },
        {
            id: 7,
            name: "SAMPLE",
            price: 999,
            category: "CLASS",
            hot: false,
            image_url: "products/1 (7).png",
            images: ["products/1 (7).png", "products/mind-3-2.jpg", "products/mind-3-3.jpg", "products/mind-3-4.jpg", "products/mind-3-5.jpg"]
        },
        {
            id: 8,
            name: "SAMPLE",
            price: 999,
            category: "CLASS",
            hot: true,
            image_url: "products/1 (8).png",
            images: ["products/1 (8).png", "products/mind-4-2.jpg", "products/mind-4-3.jpg", "products/mind-4-4.jpg", "products/mind-4-5.jpg"]
        },
        {
            id: 9,
            name: "Nike Mind 001 | Palest Purple",
            price: 3495,
            category: "CLASS",
            hot: false,
            image_url: "products/1 (9).png",
            images: ["products/1 (9).png", "products/class-1-2.jpg", "products/class-1-3.jpg", "products/class-1-4.jpg", "products/class-1-5.jpg"]
        },
        {
            id: 10,
            name: "Nike Mind 001 x NOCTA",
            price: 4500,
            category: "NIKE",
            hot: true,
            image_url: "products/1 (10).png",
            images: ["products/1 (10).png", "products/class-2-2.jpg", "products/class-2-3.jpg", "products/class-2-4.jpg", "products/class-2-5.jpg"]
        },
        {
            id: 11,
            name: "SAMPLE",
            price: 999,
            category: "CLASS",
            hot: false,
            image_url: "products/1 (11).png",
            images: ["products/1 (11).png", "products/class-3-2.jpg", "products/class-3-3.jpg", "products/class-3-4.jpg", "products/class-3-5.jpg"]
        },
        {
            id: 12,
            name: "Nike Mind 001 | Geode Teal",
            price: 3495,
            category: "NIKE",
            hot: false,
            image_url: "products/1 (12).png",
            images: ["products/1 (12).png", "products/class-4-2.jpg", "products/class-4-3.jpg", "products/class-4-4.jpg", "products/class-4-5.jpg"]
        },
        {
            id: 13,
            name: "SAMPLE",
            price: 999,
            category: "NIKE",
            hot: true,
            image_url: "products/1 (13).png",
            images: ["products/1 (13).png", "products/crocs-1-2.jpg", "products/crocs-1-3.jpg", "products/crocs-1-4.jpg", "products/crocs-1-5.jpg"]
        },
        /*
        {
            id: 14,
            name: "SAMPLE",
            price: 999,
            category: "CROCS",
            hot: false,
            image_url: "products/1 (14).png",
            images: ["products/1 (14).png", "products/crocs-2-2.jpg", "products/crocs-2-3.jpg", "products/crocs-2-4.jpg", "products/crocs-2-5.jpg"]
        },*/
        {
            id: 15,
            name: "Nike Mind 001 x NOCTA Real Tree",
            price: 4500,
            category: "NIKE",
            hot: false,
            image_url: "products/1 (15).png",
            images: ["products/1 (15).png", "products/crocs-3-2.jpg", "products/crocs-3-3.jpg", "products/crocs-3-4.jpg", "products/crocs-3-5.jpg"]
        },
        {
            id: 16,
            name: "Nike Mind 001 | Blackened Blue",
            price: 3495,
            category: "NIKE",
            hot: false,
            image_url: "products/1 (16).png",
            images: ["products/1 (16).png", "products/crocs-4-2.jpg", "products/crocs-4-3.jpg", "products/crocs-4-4.jpg", "products/crocs-4-5.jpg"]
        }
    ],
    
    
    // Ulti Story Images (portrait)
storyImages: [
    "assets/history/1 (1).png",
    "assets/history/1 (2).png",
    "assets/history/1 (3).png",
    "assets/history/1 (4).png",
    "assets/history/1 (5).png",
    "assets/history/1 (6).png",
    "assets/history/1 (7).png",
    "assets/history/1 (8).png",
    "assets/history/1 (9).png",
    "assets/history/1 (10).png",
    "assets/history/1 (11).png"
],


    // marquee
    marqueeImages: [
        "products/1 (1).png",
        "products/1 (2).png",
        "products/1 (3).png",
        "products/1 (4).png",
        "products/1 (5).png",
        "products/1 (6).png",
        "products/1 (7).png",
        "products/1 (8).png",
        "products/1 (9).png",
        "products/1 (10).png",
        "products/1 (11).png",
        "products/1 (12).png",
        "products/1 (13).png",
       /* "products/1 (14).png", */
        "products/1 (15).png",
        "products/1 (16).png"
    ],
    
    // Default fallback images kung sakaling sakaling magka-issue sa Cloudinary URL
    fallbackImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"
    
    
};