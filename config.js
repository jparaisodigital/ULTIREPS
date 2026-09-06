window.CONFIG = {
    // Store Metadata
    storeName: "Ulti Reps",
    currency: "₱",
    
    // Google Sheets / Apps Script API
    googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbzNJ02SRpIlLT4L_pQfkRAQpZ55ssvjUo-xLIw42eDn41e_FiERw53HWM8wdGWdZ50axw/exec",
    
    // Product Categories
    categories: [
        "NIKE",
        "CROCS",
        "NEW RELEASE"
    ],
    
    // Hero Images
    heroImagesDesktop: [
        "assets/hero.png",
        "assets/hero1.png",
        "assets/hero2.png"
    ],
    heroImagesMobile: [
        "assets/mobile1.png",
        "assets/mobile2.jpg",
        "assets/mobile3.jpg"
    ],
    
    // Customer Feedback / Review Screenshots
    feedbackImages: [
        "assets/feedback/1.webp",
        "assets/feedback/2.webp",
        "assets/feedback/3.webp",
        "assets/feedback/4.webp",
        "assets/feedback/5.webp",
        "assets/feedback/6.webp",
        "assets/feedback/7.webp",
        "assets/feedback/8.webp",
        "assets/feedback/9.webp"
    ],
    
    
    // Logos
    logo: "assets/logo.png",          
    logoWhite: "assets/logo-white.png", 
    
    // Site Loader
    siteLoader: {
        enabled: true,
        
        logo: "assets/logo.png",
        background: "#ffffff",
        logoFilter: "brightness(0)",
        
        logoWidth: "clamp(90px, 16vw, 170px)",
        
        minDuration: 1500,
        fadeDuration: 600,
        breatheDuration: 1000,
        
        // false = show again after refresh
        showOncePerSession: false
    },
    
    // Social Media Links
    socials: {
        facebook: "https://www.facebook.com/profile.php?id=61551038027330",
        instagram: "https://www.instagram.com/ultireps.ph/",
        tiktok: "https://www.tiktok.com/@ultireps.ph",
        messenger: "https://m.me/61551038027330"
        
    },
    
    // Payment Information - replace placeholders before launch
    payments: {
        preorderDownpayment: 500,
        gcash: {
            number: "0927 601 3928",
            accountName: "ULTI REPS",
            qrImage: "assets/gcash.jpg"
        },
        
        bank: {
            bankName: "BPI",
            accountName: "ULTI REPS",
            accountNumber: "0080032808"
        }
    },
    
    sizeChart: {
        image: "assets/chart.jpg",
        label: "Size Chart"
    },
    
    // Product Catalog
products: [
    {
        id: 1,
        name: "Nike Mind 001 | Solar Red",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (1).png",
        
        images: [
            "products/1 (1).png",
            "products/back/1 (1).webp",
            "products/back/1 (2).webp",
            "products/back/1 (3).webp",
            "products/back/1 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 2,
        name: "Nike Mind 001 x NOCTA Blue Owl",
        price: 4500,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (2).png",
        
        images: [
            "products/1 (2).png",
            "products/back/2 (1).webp",
            "products/back/2 (2).webp",
            "products/back/2 (3).webp",
            "products/back/2 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 3,
        name: "Nike Mind 001 x NOCTA Black Owl",
        price: 4500,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (3).png",
        
        images: [
            "products/1 (3).png",
            "products/back/3 (1).webp",
            "products/back/3 (2).webp",
            "products/back/3 (3).webp",
            "products/back/3 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 4,
        name: "Nike Mind 001 x NOCTA Real Tree",
        price: 4500,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (4).png",
        
        images: [
            "products/1 (4).png",
            "products/back/4 (1).webp",
            "products/back/4 (2).webp",
            "products/back/4 (3).webp",
            "products/back/4 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 5,
        name: "Nike Mind 001 | Blackened Blue",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (5).png",
        
        images: [
            "products/1 (5).png",
            "products/back/5 (1).webp",
            "products/back/5 (2).webp",
            "products/back/5 (3).webp",
            "products/back/5 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 6,
        name: "Nike Mind 001 | Light Smoke Grey",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (6).png",
        
        images: [
            "products/1 (6).png",
            "products/back/6 (1).webp",
            "products/back/6 (2).webp",
            "products/back/6 (3).webp",
            "products/back/6 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 7,
        name: "Nike Mind 001 | Black Chrome",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (7).png",
        
        images: [
            "products/1 (7).png",
            "products/back/7 (1).webp",
            "products/back/7 (2).webp",
            "products/back/7 (3).webp",
            "products/back/7 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 8,
        name: "Nike Mind 001 | Crimson Purple",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (8).png",
        
        images: [
            "products/1 (8).png",
            "products/back/8 (1).webp",
            "products/back/8 (2).webp",
            "products/back/8 (3).webp",
            "products/back/8 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 9,
        name: "Nike Mind 001 | Pearl Pink",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (9).png",
        
        images: [
            "products/1 (9).png",
            "products/back/9 (1).webp",
            "products/back/9 (2).webp",
            "products/back/9 (3).webp",
            "products/back/9 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 10,
        name: "Nike Mind 001 x FRAGMENT",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (10).png",
        
        images: [
            "products/1 (10).png",
            "products/back/10 (1).webp",
            "products/back/10 (2).webp",
            "products/back/10 (3).webp",
            "products/back/10 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 11,
        name: "Nike Mind 001 | Geode Teal",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (11).png",
        
        images: [
            "products/1 (11).png",
            "products/back/11 (1).webp",
            "products/back/11 (2).webp",
            "products/back/11 (3).webp",
            "products/back/11 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 12,
        name: "Nike Mind 001 | Team Red",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (12).png",
        
        images: [
            "products/1 (12).png",
            "products/back/12 (1).webp",
            "products/back/12 (2).webp",
            "products/back/12 (3).webp",
            "products/back/12 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 13,
        name: "Nike Mind 001 | Speed Red",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (13).png",
        
        images: [
            "products/1 (13).png",
            "products/back/13 (1).webp",
            "products/back/13 (2).webp",
            "products/back/13 (3).webp",
            "products/back/13 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 14,
        name: "Nike Mind 001 | Triple Black",
        price: 3495,
        category: "NIKE",
        hot: true,
        reserveAllowed: true,
        
        image_url: "products/1 (14).png",
        
        images: [
            "products/1 (14).png",
            "products/back/14 (1).webp",
            "products/back/14 (2).webp",
            "products/back/14 (3).webp",
            "products/back/14 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 15,
        name: "Nike Mind 001 | Hemp",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (15).png",
        
        images: [
            "products/1 (15).png",
            "products/back/15 (1).webp",
            "products/back/15 (2).webp",
            "products/back/15 (3).webp",
            "products/back/15 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    
    {
        id: 16,
        name: "Nike Mind 001 | Indigo Burst",
        price: 3495,
        category: "NIKE",
        hot: false,
        reserveAllowed: true,
        
        image_url: "products/1 (16).png",
        
        images: [
            "products/1 (16).png",
            "products/back/16 (1).webp",
            "products/back/16 (2).webp",
            "products/back/16 (3).webp",
            "products/back/16 (4).webp"
        ],
        
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },

    {
        id: 17,
        name: "Red Spiderman Neo x Crocs",
        price: 2099,
        category: "CROCS",
        hot: false,
        reserveAllowed: true,
    
        image_url: "products/1 (17).png",
    
        images: [
            "products/1 (17).png",
            "products/back/17 (1).webp",
            "products/back/17 (2).webp",
            "products/back/17 (3).webp",
            "products/back/17 (4).webp"
        ],
    
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
],  
    
    // Ulti Story Images
    storyImages: [
        "assets/history/1 (1).png",
        "assets/history/1 (2).webp",
        "assets/history/1 (3).webp",
        "assets/history/1 (4).webp",
        "assets/history/1 (5).webp",
        "assets/history/1 (6).webp",
        "assets/history/1 (7).webp",
        "assets/history/1 (8).webp",
        "assets/history/1 (9).webp",
        "assets/history/1 (10).webp",
        "assets/history/1 (11).webp"
    ],
    
    
    // Product Marquee Images
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
        "products/1 (14).png",
        "products/1 (15).png",
        "products/1 (16).png"
    ],
    
    
    // Fallback image used when a product image is unavailable
    fallbackImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"
    
};