document.addEventListener('alpine:init', () => {
    Alpine.data('storeApp', () => ({
        config: window.CONFIG,
        cartOpen: false,
        helpOpen: false,
        checkoutModalOpen: false,
        mobileMenuOpen: false,
        
        // Hero Slider State (3 images nagpapalitan)
        activeSlide: 0,
        heroImages: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80"
        ],
        
        // Products & Filtering
        products: [],
        categories: ['All'],
        selectedCategory: 'All',
        searchQuery: '',
        
        // Quick View Modal State
        quickViewOpen: false,
        quickViewProduct: null,
        quickViewSlide: 0,
        quickViewClosing: false,
        headerHidden: false,
        lastScrollY: 0,
        scrolledPastHero: false,
        
        // Cart State
        cart: JSON.parse(localStorage.getItem('ulti_cart')) || [],
        
        // Checkout Form State
        form: {
            email: '',
            firstName: '',
            lastName: '',
            address: '',
            region: '',
            contact: '',
            postalCode: '',
            orderNotes: '',
            
            receiptFile: null,
            paymentMethod: 'gcash',
            deliveryOption: 'standard'
        },
        isSubmitting: false,
        orderSuccess: false,
        messengerLink: "",
        paymentModalOpen: false,
        hotToastVisible: false,
        selectedSize: null,
        sizeChartOpen: false,
        
        // ===== SITE LOADER =====
        siteLoaderVisible: true,
        siteLoaderLeaving: false,
        
        // HOT STYLE <-> FEEDBACK popup state
        hotToastMode: 'hot',
        hotToastTimer: null,
        hotToastSwitching: false,
        
        // ===== SITE LOADER =====
        initSiteLoader() {
            const settings = this.config.siteLoader || {};
            // Skip loader once kapag galing sa internal/header navigation
            const skipLoaderOnce =
            sessionStorage.getItem('ulti_skip_loader_once') === 'true';
            
            if (skipLoaderOnce) {
                sessionStorage.removeItem('ulti_skip_loader_once');
                
                this.siteLoaderVisible = false;
                this.siteLoaderLeaving = false;
                
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                
                return;
            }
            
            // Disabled through config
            if (settings.enabled === false) {
                this.siteLoaderVisible = false;
                return;
            }
            
            // Optional: show only once per browser session
            if (
                settings.showOncePerSession &&
                sessionStorage.getItem('ulti_loader_seen') === 'true'
            ) {
                this.siteLoaderVisible = false;
                return;
            }
            
            this.siteLoaderVisible = true;
            this.siteLoaderLeaving = false;
            
            // Prevent scrolling habang loader ang nakikita
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            
            const startTime = Date.now();
            
            const hideLoader = () => {
                const minimumDuration =
                Number(settings.minDuration) || 2000;
                
                const fadeDuration =
                Number(settings.fadeDuration) || 600;
                
                const elapsed = Date.now() - startTime;
                
                const remainingTime = Math.max(
                    0,
                    minimumDuration - elapsed
                );
                
                setTimeout(() => {
                    
                    // Start fade out
                    this.siteLoaderLeaving = true;
                    
                    setTimeout(() => {
                        this.siteLoaderVisible = false;
                        this.siteLoaderLeaving = false;
                        
                        // Restore scrolling
                        document.documentElement.style.overflow = '';
                        document.body.style.overflow = '';
                        
                        if (settings.showOncePerSession) {
                            sessionStorage.setItem(
                                'ulti_loader_seen',
                                'true'
                            );
                        }
                        
                    }, fadeDuration);
                    
                }, remainingTime);
            };
            
            // Hintayin muna na fully loaded ang page/images
            if (document.readyState === 'complete') {
                hideLoader();
            } else {
                window.addEventListener(
                    'load',
                    hideLoader,
                    { once: true }
                );
            }
        },
        
        // ===== HOT PRODUCTS =====
        get hotProducts() {
            return this.products.filter(p => p.hot === true);
        },
        
        initShop() {
            this.initHeader();
            
            setInterval(() => {
                this.activeSlide = (this.activeSlide + 1) % this.heroImages.length;
            }, 5000);
            
            // Load products directly from config.js
            this.products = Array.isArray(this.config.products)
            ? this.config.products
            : [];
            
            this.extractCategories();
            
            // HOT STYLE toast 
            const dismissed = localStorage.getItem('ulti_hot_toast_dismissed');
            
            if (!dismissed) {
                setTimeout(() => {
                    this.hotToastVisible = true;
                    this.hotToastMode = 'hot';
                    this.startHotToastLoop();
                }, 4000);
            }
            
            // Esc key closes Quick View (existing)
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.quickViewOpen) {
                    this.closeQuickView();
                }
            });
        },
        
        initHeader() {
            this.lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentY = window.scrollY;
                
                // Header background change after hero
                this.scrolledPastHero = currentY > window.innerHeight - 80;
                
                // Hide / show logic
                if (currentY < 80) {
                    this.headerHidden = false;
                } else if (currentY > this.lastScrollY + 8) {
                    this.headerHidden = true;
                } else if (currentY < this.lastScrollY - 8) {
                    this.headerHidden = false;
                }
                
                this.lastScrollY = currentY;
            }, { passive: true });
        },
        
        // ===== TOAST ACTIONS =====
        
        startHotToastLoop() {
            this.stopHotToastLoop();
            
            this.hotToastTimer = setInterval(() => {
                this.switchHotToastContent();
            }, 5000);
        },
        
        switchHotToastContent() {
            // Fade out
            this.hotToastSwitching = true;
            
            setTimeout(() => {
                
                // Change content habang invisible
                this.hotToastMode =
                this.hotToastMode === 'hot'
                ? 'feedback'
                : 'hot';
                
                // Fade back in
                this.hotToastSwitching = false;
                
            }, 300);
        },
        
        stopHotToastLoop() {
            if (this.hotToastTimer) {
                clearInterval(this.hotToastTimer);
                this.hotToastTimer = null;
            }
        },
        
        dismissHotToast(permanent = false) {
            this.hotToastVisible = false;
            
            if (permanent) {
                localStorage.setItem('ulti_hot_toast_dismissed', 'true');
            }
        },
        
        goToHotProducts() {
            this.dismissHotToast(false);
            
            this.selectedCategory = 'HOT';
            
            const el = document.getElementById('shop');
            
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },
        
        goToFeedback() {
            this.stopHotToastLoop();
            
            // Play popup exit animation first
            this.hotToastVisible = false;
            
            // Navigate after animation finishes
            setTimeout(() => {
                window.location.href = 'feedback.html';
            }, 300);
        },
        
        // Open the Quick View modal for a clicked product
        openQuickView(product) {
            this.quickViewProduct = product;
            this.quickViewSlide = 0;
            this.selectedSize = null;
            this.sizeChartOpen = false;
            
            this.quickViewOpen = true;
        },
        
        // Close the Quick View modal
        closeQuickView() {
            this.quickViewOpen = false;
            this.quickViewProduct = null;
            this.quickViewClosing = false;
        },
        
        // Add to cart then close with animation
        addToCartAndClose(product) {
            
            if (product.sizes && product.sizes.length && !this.selectedSize) {
                return;
            }
            
            this.addToCart(product, this.selectedSize);
            
            this.quickViewClosing = true;
            
            setTimeout(() => {
                this.closeQuickView();
                this.quickViewClosing = false;
            }, 280);
        },
        
        // Go to next image in the Quick View slider
        nextQuickViewSlide() {
            if (!this.quickViewProduct) return;
            const images = (this.quickViewProduct.images && this.quickViewProduct.images.length)
            ? this.quickViewProduct.images
            : [this.quickViewProduct.image_url];
            this.quickViewSlide = (this.quickViewSlide + 1) % images.length;
        },
        
        // Go to previous image in the Quick View slider
        prevQuickViewSlide() {
            if (!this.quickViewProduct) return;
            const images = (this.quickViewProduct.images && this.quickViewProduct.images.length)
            ? this.quickViewProduct.images
            : [this.quickViewProduct.image_url];
            this.quickViewSlide = (this.quickViewSlide - 1 + images.length) % images.length;
        },
        
        async fetchProducts() {
            // Priority 1: Use the hardcoded products already defined in config.js
            // (this is where your 4 real products with their actual image_url paths live)
            if (Array.isArray(this.config.products) && this.config.products.length > 0) {
                this.products = this.config.products;
                this.extractCategories();
                return;
            }
            
            // Priority 2: Google Sheets CSV (only used if config.products is empty)
            if (!this.config.googleSheetCSV || this.config.googleSheetCSV.includes("YOUR_GOOGLE")) {
                // Mock data kung wala pang nakalagay na Google Sheet link para makita agad ang UI
                this.products = [
                    { id: '1', name: 'Heavyweight Boxy Tee', category: 'Apparel', price: '1200', stock: 'In Stock', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
                    { id: '2', name: 'Vintage Washed Hoodie', category: 'Apparel', price: '2500', stock: 'In Stock', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
                    { id: '3', name: 'Premium Leather Crossbody', category: 'Accessories', price: '1800', stock: 'In Stock', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
                    { id: '4', name: 'Minimalist Runner Sneakers', category: 'Footwear', price: '3200', stock: 'In Stock', image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' }
                ];
                this.extractCategories();
                return;
            }
            
            try {
                const response = await fetch(this.config.googleSheetCSV);
                const csvText = await response.text();
                this.parseCSV(csvText);
            } catch (error) {
                console.error("Error fetching Google Sheets data:", error);
            }
        },
        
        parseCSV(text) {
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
            
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let val = currentline[j] ? currentline[j].trim() : '';
                    val = val.replace(/^["']|["']$/g, ''); // remove quotes
                    obj[headers[j]] = val;
                }
                result.push(obj);
            }
            this.products = result;
            this.extractCategories();
        },
        
        extractCategories() {
            this.categories = ['All', 'HOT', ...(this.config.categories || [])];
        },
        
        get filteredProducts() {
            return this.products.filter(product => {
                const matchesCategory = 
                this.selectedCategory === 'All' || 
                (this.selectedCategory === 'HOT' && product.hot === true) ||
                product.category === this.selectedCategory;
                
                const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        },
        
        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
        },
        
        // Same Day Delivery fee (₱150)
        get regionShippingFee() {
            if (this.form.deliveryOption === 'same_day') return 0;
            if (this.form.region === 'luzon') return 100;
            if (this.form.region === 'vismin') return 150;
            return 0;
        },
        
        get grandTotal() {
            return this.cartTotal + this.regionShippingFee;
        },
        
        get canSubmit() {
            return this.form.name && 
            this.form.address && 
            this.form.contact && 
            this.form.paymentMethod && 
            this.form.deliveryOption &&
            this.form.receiptFile;
        },
        
        addToCart(product, size = null) {
            
            // Products with sizes must have a selected size
            if (product.sizes && product.sizes.length && !size) {
                this.openQuickView(product);
                return;
            }
            
            // Same product + same size = same cart line
            const existing = this.cart.find(item =>
                item.id === product.id &&
                item.selectedSize === size
            );
            
            if (existing) {
                existing.quantity++;
            } else {
                this.cart.push({
                    ...product,
                    selectedSize: size,
                    quantity: 1
                });
            }
            
            this.saveCart();
            this.cartOpen = true;
        },
        
        updateQuantity(id, size, change) {
            
            const item = this.cart.find(i =>
                i.id === id &&
                i.selectedSize === size
            );
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    this.cart = this.cart.filter(i =>
                        !(
                            i.id === id &&
                            i.selectedSize === size
                        )
                    );
                }
            }
            
            this.saveCart();
        },
        
        removeFromCart(id, size) {
            
            this.cart = this.cart.filter(i =>
                !(
                    i.id === id &&
                    i.selectedSize === size
                )
            );
            
            this.saveCart();
        },
        
        saveCart() {
            localStorage.setItem('ulti_cart', JSON.stringify(this.cart));
        },
        
        handleFileUpload(event) {
            this.form.receiptFile = event.target.files[0];
        },
        
        // Used by checkout.html
        initCheckoutPage() {
            this.initHeader();
            // Reload cart from localStorage in case it changed
            this.cart = JSON.parse(localStorage.getItem('ulti_cart')) || [];
        },
        
        openPaymentModal() {
            
            if (
                !this.form.email ||
                !this.form.firstName ||
                !this.form.lastName ||
                !this.form.address ||
                !this.form.contact ||
                !this.form.region
            ) {
                alert("Please complete all required checkout details.");
                return;
            }
            
            if (
                this.form.deliveryOption !== 'same_day' &&
                !this.form.paymentMethod
            ) {
                alert("Please select a payment method.");
                return;
            }
            
            this.paymentModalOpen = true;
        },
        
        async submitOrder() {
            if (
                !this.form.email ||
                !this.form.firstName ||
                !this.form.lastName ||
                !this.form.address ||
                !this.form.contact ||
                !this.form.region
            ) {
                alert("Please complete all required checkout details.");
                return;
            }
            if (!this.form.paymentMethod) {
                alert("Please select a payment method.");
                return;
            }
            // Receipt is optional now (uploaded in the modal)
            
            this.isSubmitting = true;
            
            const paymentLabel = {
                gcash: 'GCash',
                maya: 'Maya',
                bank: 'Bank Transfer'
            }[this.form.paymentMethod] || this.form.paymentMethod;
            
            const deliveryLabel = this.form.deliveryOption === 'same_day' 
            ? 'Same Day Delivery (+₱150)' 
            : 'Standard Delivery';
            
            // Clean order summary (no emojis)
            let orderSummary = `NEW ORDER - ${this.config.storeName || 'Ulti'}\n\n`;
            
            orderSummary += `Name: ${this.form.firstName} ${this.form.lastName}\n`;
            orderSummary += `Email: ${this.form.email}\n`;
            orderSummary += `Phone: ${this.form.contact}\n`;
            orderSummary += `Address: ${this.form.address}\n`;
            orderSummary += `Region: ${this.form.region}\n`;
            
            if (this.form.postalCode) {
                orderSummary += `Postal Code: ${this.form.postalCode}\n`;
            }
            
            if (this.form.orderNotes) {
                orderSummary += `Order Notes: ${this.form.orderNotes}\n`;
            }
            
            orderSummary += `Delivery: ${deliveryLabel}\n`;
            orderSummary += `Payment: ${paymentLabel}\n\n`;
            orderSummary += `Address: ${this.form.address}\n`;
            orderSummary += `Contact: ${this.form.contact}\n`;
            orderSummary += `Delivery: ${deliveryLabel}\n`;
            orderSummary += `Payment: ${paymentLabel}\n\n`;
            
            orderSummary += `Items:\n`;
            
            this.cart.forEach(item => {
                
                const sizeText =
                item.selectedSize !== null &&
                item.selectedSize !== undefined
                ? ` | Size: US ${item.selectedSize}`
                : '';
                
                orderSummary +=
                `- ${item.name}${sizeText} | Qty: ${item.quantity} - ₱${(item.price * item.quantity).toLocaleString()}\n`;
                
            });
            
            orderSummary += `\nSubtotal: ₱${this.cartTotal.toLocaleString()}`;
            
            if (this.deliveryFee > 0) {
                orderSummary += `\nSame Day Fee: ₱${this.deliveryFee}`;
            }
            
            orderSummary += `\nTOTAL: ₱${this.grandTotal.toLocaleString()}`;
            
            // Success state
            this.isSubmitting = false;
            this.orderSuccess = true;
            this.cart = [];
            this.saveCart();
            
            // Messenger link
            const messengerBase = (this.config.socials && this.config.socials.messenger) 
            ? this.config.socials.messenger 
            : "https://m.me/61551038027330";
            
            this.messengerLink = messengerBase + "?text=" + encodeURIComponent(orderSummary);
            
            // Auto open Messenger
            setTimeout(() => {
                window.open(this.messengerLink, "_blank");
            }, 600);
        },
    }));
});