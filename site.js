document.addEventListener('alpine:init', () => {
    Alpine.data('storeApp', () => ({
        config: window.CONFIG,
        cartOpen: false,
        helpOpen: false,
        mobileMenuOpen: false,
        
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
        preOrderExpanded: false,
        // Pre-order Modal State
        preOrderModalOpen: false,
        preOrderProduct: null,
        
        preOrderForm: {
            name: '',
            contact: '',
            location: '',
            note: '',
            size: null,
            quantity: 1,
            proofFile: null,
            proofPreview: ''
        },
        
        // ===== SITE LOADER STATE =====
        siteLoaderVisible: true,
        siteLoaderLeaving: false,
        
        // HOT STYLE <-> FEEDBACK popup state
        hotToastMode: 'hot',
        hotToastTimer: null,
        hotToastSwitching: false,
        
        // ===== SITE LOADER LOGIC =====
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
        
        initShop() {
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
            
            this.preOrderExpanded = false;
            
            this.preOrderForm = {
                name: '',
                contact: '',
                size: null,
                quantity: 1,
                proofFile: null,
                proofPreview: ''
            };
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            this.quickViewOpen = true;
        },
        
        // Close the Quick View modal
        closeQuickView() {
            this.quickViewOpen = false;
            this.quickViewProduct = null;
            this.quickViewClosing = false;
            
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        },
        
        // ===== PRE-ORDER MODAL =====
        openPreOrderModal(product) {
            if (!product) return;
            
            if (
                Number(product.stock) !== 0 ||
                product.reserveAllowed !== true
            ) {
                return;
            }
            
            this.preOrderProduct = product;
            
            this.preOrderForm = {
                name: '',
                contact: '',
                size: null,
                quantity: 1
            };
            
            this.preOrderModalOpen = true;
            
        },
        
        handlePreOrderProof(event) {
            const file = event.target.files?.[0];
            
            if (!file) {
                this.preOrderForm.proofFile = null;
                this.preOrderForm.proofPreview = '';
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                event.target.value = '';
                return;
            }
            
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (file.size > maxSize) {
                alert('Payment screenshot must be 5MB or smaller.');
                event.target.value = '';
                return;
            }
            
            this.preOrderForm.proofFile = file;
            
            if (this.preOrderForm.proofPreview) {
                URL.revokeObjectURL(this.preOrderForm.proofPreview);
            }
            
            this.preOrderForm.proofPreview =
            URL.createObjectURL(file);
        },
        
        closePreOrderModal() {
            this.preOrderModalOpen = false;
            this.preOrderProduct = null;
            
            this.preOrderForm = {
                name: '',
                contact: '',
                size: null,
                quantity: 1
            };
        },
        
        submitPreOrderPreview() {
            if (!this.preOrderProduct) return;
            
            if (!this.preOrderForm.name.trim()) {
                alert('Please enter your name.');
                return;
            }
            
            if (!this.preOrderForm.contact.trim()) {
                alert('Please enter your contact number.');
                return;
            }

            if (!this.preOrderForm.location.trim()) {
                alert('Please enter your location.');
                return;
            }
            
            if (
                this.preOrderProduct.sizes &&
                this.preOrderProduct.sizes.length &&
                !this.preOrderForm.size
            ) {
                alert('Please select a size.');
                return;
            }
            
            if (!this.preOrderForm.proofFile) {
                alert('Please upload your GCash payment screenshot.');
                return;
            }
            
            console.log('PRE-ORDER PREVIEW:', {
                productId: product.id,
                productName: product.name,
                size: this.preOrderForm.size,
                quantity: this.preOrderForm.quantity,
            
                name: this.preOrderForm.name,
                contact: this.preOrderForm.contact,
                location: this.preOrderForm.location,
                note: this.preOrderForm.note,
            
                requiredDownpayment:
                    this.config.payments.preorderDownpayment,
            
                proofFile:
                    this.preOrderForm.proofFile.name
            });
            
            alert('Pre-order form is ready. Google Sheet submission will be connected next.');
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
        
        // ===== PER-SIZE INVENTORY =====
        
        getSizeStock(product, size) {
            if (!product) return null;
            
            if (product.stockBySize) {
                const key = String(size);
                
                if (
                    Object.prototype.hasOwnProperty.call(
                        product.stockBySize,
                        key
                    )
                ) {
                    return Number(product.stockBySize[key]) || 0;
                }
            }
            
            // Fallback for old global stock format
            if (
                product.stock !== undefined &&
                product.stock !== null &&
                product.stock !== ''
            ) {
                return Number(product.stock) || 0;
            }
            
            // No inventory data yet
            return null;
        },
        
        isSizeSoldOut(product, size) {
            const stock = this.getSizeStock(product, size);
            
            return stock !== null && stock <= 0;
        },
        
        canPreOrderSize(product, size) {
            return (
                this.isSizeSoldOut(product, size) &&
                product.reserveAllowed === true
            );
        },
        
        isProductSoldOut(product) {
            if (!product) return false;
            
            if (
                Array.isArray(product.sizes) &&
                product.sizes.length &&
                product.stockBySize
            ) {
                return product.sizes.every(size => {
                    const stock = this.getSizeStock(product, size);
                    
                    return stock !== null && stock <= 0;
                });
            }
            
            if (
                product.stock !== undefined &&
                product.stock !== null &&
                product.stock !== ''
            ) {
                return Number(product.stock) <= 0;
            }
            
            return false;
        },
        
        selectProductSize(size) {
            this.selectedSize = size;
            
            if (
                this.canPreOrderSize(
                    this.quickViewProduct,
                    size
                )
            ) {
                // Remember which sold-out size customer wants
                this.preOrderForm.size = size;
            } else {
                // Back to normal purchase mode
                this.preOrderExpanded = false;
                this.preOrderForm.size = null;
            }
        },
        
        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
        },
        
        
        // Standard shipping fee based on region
        get regionShippingFee() {
            if (this.form.deliveryOption === 'same_day') return 0;
            if (this.form.region === 'luzon') return 100;
            if (this.form.region === 'vismin') return 150;
            return 0;
        },
        
        get grandTotal() {
            return this.cartTotal + this.regionShippingFee;
        },
        
        addToCart(product, size = null) {
            
            // Products with sizes must have a selected size
            if (product.sizes && product.sizes.length && !size) {
                this.openQuickView(product);
                return;
            }
            
            // Never add a zero-stock size to the normal cart
            if (size && this.isSizeSoldOut(product, size)) {
                alert(`Size US ${size} is currently sold out.`);
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
            // ===== BASIC CHECKOUT VALIDATION =====
            const email = this.form.email.trim();
            const contact = this.form.contact.replace(/[\s-]/g, '');
            
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const phoneValid = /^(?:\+63|0)9\d{9}$/.test(contact);
            
            if (
                !email ||
                !this.form.firstName.trim() ||
                !this.form.lastName.trim() ||
                !this.form.address.trim() ||
                !contact ||
                !this.form.region
            ) {
                alert("Please complete all required checkout details.");
                return;
            }
            
            if (!emailValid) {
                alert("Please enter a valid email address.");
                return;
            }
            
            if (!phoneValid) {
                alert("Please enter a valid Philippine mobile number.");
                return;
            }
            
            // Same-day is arranged separately via Messenger / COD.
            if (
                this.form.deliveryOption !== 'same_day' &&
                !this.form.paymentMethod
            ) {
                alert("Please select a payment method.");
                return;
            }
            
            if (!this.cart.length) {
                alert("Your cart is empty.");
                return;
            }
            
            this.isSubmitting = true;
            
            // ===== PAYMENT LABEL =====
            const paymentLabel =
            this.form.deliveryOption === 'same_day'
            ? 'Payment arrangement via Messenger'
            : ({
                gcash: 'GCash',
                maya: 'Maya',
                bank: 'Bank Transfer'
            }[this.form.paymentMethod] || this.form.paymentMethod);
            
            // ===== DELIVERY LABEL =====
            const deliveryLabel =
            this.form.deliveryOption === 'same_day'
            ? 'Same Day Delivery - Shipping fee arranged via Messenger'
            : 'Standard Delivery';
            
            // ===== REGION LABEL =====
            const regionLabel = {
                luzon: 'Luzon',
                vismin: 'Visayas / Mindanao'
            }[this.form.region] || this.form.region;
            
            // ===== ORDER SUMMARY =====
            let orderSummary =
            `NEW ORDER - ${this.config.storeName || 'Ulti'}\n\n`;
            
            orderSummary +=
            `CUSTOMER DETAILS\n` +
            `Name: ${this.form.firstName.trim()} ${this.form.lastName.trim()}\n` +
            `Email: ${email}\n` +
            `Phone: ${contact}\n` +
            `Address: ${this.form.address.trim()}\n` +
            `Region: ${regionLabel}\n`;
            
            if (this.form.postalCode.trim()) {
                orderSummary +=
                `Postal Code: ${this.form.postalCode.trim()}\n`;
            }
            
            if (this.form.orderNotes.trim()) {
                orderSummary +=
                `Order Notes: ${this.form.orderNotes.trim()}\n`;
            }
            
            orderSummary +=
            `\nDELIVERY & PAYMENT\n` +
            `Delivery: ${deliveryLabel}\n` +
            `Payment: ${paymentLabel}\n\n`;
            
            orderSummary += `ITEMS\n`;
            
            this.cart.forEach(item => {
                const sizeText =
                item.selectedSize !== null &&
                item.selectedSize !== undefined
                ? ` | Size: US ${item.selectedSize}`
                : '';
                
                const lineTotal =
                Number(item.price) * Number(item.quantity);
                
                orderSummary +=
                `- ${item.name}${sizeText} | Qty: ${item.quantity} | ₱${lineTotal.toLocaleString()}\n`;
            });
            
            orderSummary +=
            `\nSubtotal: ₱${this.cartTotal.toLocaleString()}`;
            
            if (this.regionShippingFee > 0) {
                orderSummary +=
                `\nShipping: ₱${this.regionShippingFee.toLocaleString()}`;
            }
            
            if (this.form.deliveryOption === 'same_day') {
                orderSummary +=
                `\nSame-Day Shipping: To be arranged via Messenger`;
            }
            
            orderSummary +=
            `\nTOTAL: ₱${this.grandTotal.toLocaleString()}`;
            
            // ===== MESSENGER =====
            const messengerBase = this.config.socials?.messenger;
            
            if (!messengerBase) {
                this.isSubmitting = false;
                alert("Messenger link is not configured.");
                return;
            }
            
            this.messengerLink =
            messengerBase +
            "?text=" +
            encodeURIComponent(orderSummary);
            
            this.isSubmitting = false;
            
            /*
            * IMPORTANT:
            * Do NOT clear the cart here.
            * Opening Messenger does NOT guarantee
            * that the customer actually sent the message.
            */
            this.orderSuccess = true;
            
            window.open(
                this.messengerLink,
                "_blank",
                "noopener,noreferrer"
            );
        },
    }));
});