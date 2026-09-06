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
        isPreOrderSubmitting: false,
        
        // Pre-order validation / success state
        preOrderError: '',
        preOrderSuccess: false,
        preOrderReservationId: '',
        
        orderSuccess: false,
        messengerLink: "",
        preparedOrderDetails: "",
        paymentModalOpen: false,
        
        checkoutNotice: {
            show: false,
            message: '',
            type: 'info'
        },
        
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
            website: '',
            size: null,
            quantity: 1,
            proofFile: null,
            proofPreview: ''
        },
        
        // ===== SITE LOADER STATE =====
        siteLoaderVisible: true,
        siteLoaderLeaving: false,
        
        // ===== MONTHLY SALE MODAL STATE =====
        saleModalVisible: false,
        saleModalTimer: null,
        
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
        
        async initShop() {
            // Load products directly from config.js
            this.products = Array.isArray(this.config.products)
            ? this.config.products
            : [];
            
            this.extractCategories();
            
            // Load Google Sheet data, config.js stays as fallback
            await this.loadGoogleSheetData();
            
            // Monthly Sale Modal first.
            // Hot Style toast will wait until the Sale modal is closed.
            this.initSaleModal();
            
            // ESC key behavior
            window.addEventListener('keydown', (e) => {
                
                if (e.key !== 'Escape') return;
                
                // Sale modal gets priority
                if (this.saleModalVisible) {
                    this.closeSaleModal();
                    return;
                }
                
                // Existing Quick View
                if (this.quickViewOpen) {
                    this.closeQuickView();
                }
                
            });
        },
        
        async loadGoogleSheetData() {
            
            const url = this.config.googleAppsScriptUrl;
            
            // Walang API URL = gamitin lang ang config.js
            if (!url) {
                console.log('Google Sheet API not configured. Using config.js.');
                return;
            }
            
            try {
                
                const response = await fetch(
                    `${url}?_=${Date.now()}`,
                    {
                        cache: 'no-store'
                    }
                );
                
                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }
                
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(
                        'Google Sheet API returned success: false'
                    );
                }
                
                
                // ===== BUILD INVENTORY PER PRODUCT =====
                
                const inventoryByProduct = {};
                
                (data.inventory || []).forEach(row => {
                    
                    const productId =
                    String(row.ProductID || '').trim();
                    
                    const size =
                    String(row.Size || '').trim();
                    
                    const stock =
                    Number(row.Stock) || 0;
                    
                    if (!productId || !size) return;
                    
                    if (!inventoryByProduct[productId]) {
                        inventoryByProduct[productId] = {};
                    }
                    
                    inventoryByProduct[productId][size] = stock;
                    
                });
                
                
                // ===== MERGE SHEET DATA INTO CONFIG PRODUCTS =====
                
                this.products = this.products.map(product => {
                    
                    // Match config product ID to Google Sheet ProductID
                    const expectedProductId =
'NK' + String(product.id).padStart(3, '0');
                    
                    const sheetProduct =
                    (data.products || []).find(row =>
                        String(row.ProductID || '').trim() ===
                        expectedProductId
                    );
                    
                    if (!sheetProduct) {
                        return product;
                    }
                    
                    const productId =
                    String(sheetProduct.ProductID || '').trim();
                    
                    return {
                        
                        ...product,
                        
                        // Stable Google Sheet Product ID
                        productId: productId,
                        
                        // Google Sheet controlled values
                        price:
                        Number(sheetProduct.RegularPrice) ||
                        Number(product.price) ||
                        0,
                        
                        discountAmount:
                        Number(sheetProduct.DiscountAmount) || 0,
                        
                        category:
                        sheetProduct.Category ||
                        product.category,
                        
                        hot:
                        sheetProduct.Hot === true ||
                        String(sheetProduct.Hot).toLowerCase() === 'true',
                        
                        active:
                        sheetProduct.Active === true ||
                        String(sheetProduct.Active).toLowerCase() === 'true',
                        
                        reserveAllowed:
                        sheetProduct.ReserveAllowed === true ||
                        String(sheetProduct.ReserveAllowed).toLowerCase() === 'true',
                        
                        // Per-size inventory from WEB_INVENTORY
                        stockBySize:
                        inventoryByProduct[productId] ||
                        product.stockBySize
                        
                    };
                    
                });
                
                
                this.extractCategories();
                
                // ===== PAYMENT SETTINGS FROM GOOGLE SHEET =====
                const paymentSettings = data.paymentSettings || {};
                
                if (!this.config.payments) {
                    this.config.payments = {};
                }
                
                if (!this.config.payments.gcash) {
                    this.config.payments.gcash = {};
                }
                
                if (paymentSettings.PreorderDownpayment !== undefined) {
                    this.config.payments.preorderDownpayment =
                    Number(paymentSettings.PreorderDownpayment) || 500;
                }
                
                if (paymentSettings.PreorderDelivery) {
                    this.config.payments.preorderDelivery =
                    String(paymentSettings.PreorderDelivery).trim();
                }
                
                if (paymentSettings.GCashNumber) {
                    this.config.payments.gcash.number =
                    String(paymentSettings.GCashNumber).trim();
                }
                
                if (paymentSettings.GCashAccountName) {
                    this.config.payments.gcash.accountName =
                    String(paymentSettings.GCashAccountName).trim();
                }
                
                if (
                    paymentSettings.GCashQR &&
                    paymentSettings.GCashQR !== 'TEST_URL_MUNA'
                ) {
                    this.config.payments.gcash.qrImage =
                    String(paymentSettings.GCashQR).trim();
                }
                
                // ===== PROMO SETTINGS FROM GOOGLE SHEET =====
                const promoSettings = data.promoSettings || {};
                
                if (!this.config.saleModal) {
                    this.config.saleModal = {};
                }
                
                // Enabled
                if (promoSettings.Enabled !== undefined) {
                    this.config.saleModal.enabled =
                    promoSettings.Enabled === true ||
                    String(promoSettings.Enabled).toLowerCase() === 'true';
                }
                
                // Promo ID
                if (promoSettings.PromoID) {
                    this.config.saleModal.promoId =
                    String(promoSettings.PromoID).trim();
                }
                
                // Eyebrow
                if (promoSettings.Eyebrow) {
                    this.config.saleModal.eyebrow =
                    String(promoSettings.Eyebrow).trim();
                }
                
                // Main sale number
                if (promoSettings.SaleNumber) {
                    this.config.saleModal.saleNumber =
                    String(promoSettings.SaleNumber).trim();
                }
                
                // SALE label
                if (promoSettings.SaleLabel) {
                    this.config.saleModal.saleLabel =
                    String(promoSettings.SaleLabel).trim();
                }
                
                // Discount text
                if (promoSettings.DiscountText) {
                    this.config.saleModal.discountText =
                    String(promoSettings.DiscountText).trim();
                }
                
                // Message
                if (promoSettings.Message) {
                    this.config.saleModal.message =
                    String(promoSettings.Message).trim();
                }
                
                // Button text
                if (promoSettings.ButtonText) {
                    this.config.saleModal.buttonText =
                    String(promoSettings.ButtonText).trim();
                }
                
                // Footer text
                if (promoSettings.FooterText) {
                    this.config.saleModal.footerText =
                    String(promoSettings.FooterText).trim();
                }
                
                
                console.log(
                    'ULTI GOOGLE SHEET MERGE SUCCESS:',
                    data
                );
                
            } catch (error) {
                
                // IMPORTANT:
                // Kapag pumalya ang Google Sheet,
                // hindi mawawala products.
                // config.js remains the fallback.
                console.warn(
                    'Google Sheet unavailable. Using config.js fallback.',
                    error
                );
                
            }
            
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
        
        // ===== MONTHLY SALE MODAL =====
        
        initSaleModal() {

            const settings =
                this.config.saleModal || {};
        
            if (settings.enabled === false) {
                this.scheduleHotToast();
                return;
            }
        
            if (this.saleModalTimer) {
                clearTimeout(this.saleModalTimer);
            }
        
            const delay =
                Math.max(
                    0,
                    Number(settings.showDelay) || 0
                );
        
            const openWhenReady = () => {
        
                if (this.siteLoaderVisible) {
                    this.saleModalTimer =
                        setTimeout(openWhenReady, 100);
                    return;
                }
        
                this.stopHotToastLoop();
                this.hotToastVisible = false;
        
                document.documentElement.style.overflow =
                    'hidden';
        
                document.body.style.overflow =
                    'hidden';
        
                this.saleModalVisible = true;
            };
        
            this.saleModalTimer =
                setTimeout(
                    openWhenReady,
                    delay
                );
        },
        
        
        closeSaleModal() {

            this.saleModalVisible = false;
        
            if (!this.quickViewOpen) {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }
        
            this.scheduleHotToast();
        },
        
        
        shopSale() {
            
            // Close without permanently hiding promo
            this.closeSaleModal();
            
            // Show discounted products only
            this.selectedCategory = 'SALE';
            
            const shop =
            document.getElementById('shop');
            
            if (shop) {
                setTimeout(() => {
                    
                    shop.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                }, 250);
            }
            
        },
        
        
        scheduleHotToast() {
            
            const dismissed =
            localStorage.getItem(
                'ulti_hot_toast_dismissed'
            );
            
            if (dismissed) return;
            
            const delay =
            Number(
                this.config.saleModal?.hotToastDelay
            ) || 2500;
            
            setTimeout(() => {
                
                // Never overlap the Sale modal
                if (this.saleModalVisible) return;
                
                this.hotToastVisible = true;
                this.hotToastMode = 'hot';
                
                this.startHotToastLoop();
                
            }, delay);
            
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
            
            // Clean old preview URL first
            if (this.preOrderForm?.proofPreview) {
                URL.revokeObjectURL(
                    this.preOrderForm.proofPreview
                );
            }
            
            this.quickViewProduct = product;
            this.quickViewSlide = 0;
            
            this.selectedSize = null;
            this.sizeChartOpen = false;
            
            // Reset pre-order UI state
            this.preOrderExpanded = false;
            this.preOrderError = '';
            this.preOrderSuccess = false;
            this.preOrderReservationId = '';
            
            // Reset complete pre-order form
            this.preOrderForm = {
                name: '',
                contact: '',
                location: '',
                note: '',
                website: '',
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
            
            // Clear previous error
            this.preOrderError = '';
            
            if (!file) {
                this.preOrderForm.proofFile = null;
                this.preOrderForm.proofPreview = '';
                return;
            }
            
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                
                this.preOrderError =
                'Please upload a JPG, PNG, or WEBP image.';
                
                event.target.value = '';
                
                this.preOrderForm.proofFile = null;
                this.preOrderForm.proofPreview = '';
                
                return;
            }
            
            const maxSize =
            5 * 1024 * 1024;
            
            if (file.size > maxSize) {
                
                this.preOrderError =
                'Payment screenshot must be 5MB or smaller.';
                
                event.target.value = '';
                
                this.preOrderForm.proofFile = null;
                this.preOrderForm.proofPreview = '';
                
                return;
            }
            
            this.preOrderForm.proofFile = file;
            
            if (this.preOrderForm.proofPreview) {
                URL.revokeObjectURL(
                    this.preOrderForm.proofPreview
                );
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
        
        fileToBase64(file) {
            
            return new Promise((resolve, reject) => {
                
                const reader = new FileReader();
                
                reader.onload = () => {
                    
                    const result =
                    String(reader.result || '');
                    
                    const base64 =
                    result.includes(',')
                    ? result.split(',')[1]
                    : result;
                    
                    resolve(base64);
                };
                
                reader.onerror = () => {
                    reject(
                        new Error(
                            'Unable to read payment screenshot.'
                        )
                    );
                };
                
                reader.readAsDataURL(file);
                
            });
            
        },
        
        async submitPreOrderPreview() {
            
            const product = this.quickViewProduct;
            
            // Prevent double submit
            if (this.isPreOrderSubmitting) return;
            
            // Clear previous warning
            this.preOrderError = '';
            
            if (!product) {
                this.preOrderError = 'Product information is missing.';
                return;
            }
            
            if (!this.preOrderForm.name.trim()) {
                this.preOrderError = 'Please enter your full name.';
                return;
            }
            
            if (!this.preOrderForm.contact.trim()) {
                this.preOrderError = 'Please enter your contact number.';
                return;
            }
            
            const contact =
            this.preOrderForm.contact.replace(/[\s-]/g, '');
            
            const phoneValid =
            /^(?:\+63|0)9\d{9}$/.test(contact);
            
            if (!phoneValid) {
                this.preOrderError =
                'Please enter a valid Philippine mobile number.';
                return;
            }
            
            if (!this.preOrderForm.location.trim()) {
                this.preOrderError =
                'Please enter your location.';
                return;
            }
            
            if (
                product.sizes &&
                product.sizes.length &&
                !this.preOrderForm.size
            ) {
                this.preOrderError =
                'Please select a pre-order size.';
                return;
            }
            
            if (!this.preOrderForm.proofFile) {
                this.preOrderError =
                'Please upload your GCash payment screenshot.';
                return;
            }
            
            try {
                
                // Lock submit button
                this.isPreOrderSubmitting = true;
                
                // ===== PREPARE PAYMENT PROOF =====
                const proofFile =
                this.preOrderForm.proofFile;
                
                const proofBase64 =
                await this.fileToBase64(proofFile);
                
                const payload = {
                    name: this.preOrderForm.name.trim(),
                    contact: this.preOrderForm.contact.trim(),
                    location: this.preOrderForm.location.trim(),
                    
                    productId:
                    product.productId || product.id,
                    
                    productName:
                    product.name,
                    
                    size:
                    this.preOrderForm.size,
                    
                    quantity:
                    Number(this.preOrderForm.quantity) || 1,
                    
                    downpayment:
                    (
                        Number(
                            this.config.payments.preorderDownpayment
                        ) || 0
                    ) *
                    (
                        Number(this.preOrderForm.quantity) || 1
                    ),
                    
                    note:
                    this.preOrderForm.note || '',
                    
                    website:
                    this.preOrderForm.website || '',
                    
                    proofBase64:
                    proofBase64,
                    
                    proofMimeType:
                    proofFile.type,
                    
                    proofFileName:
                    proofFile.name
                };
                
                const response = await fetch(
                    this.config.googleAppsScriptUrl,
                    {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    }
                );
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(
                        result.message ||
                        'Reservation submission failed.'
                    );
                }
                
                console.log(
                    'RESERVATION SUBMITTED:',
                    result
                );
                
                
                // ===== SHOW PRE-ORDER SUCCESS STATE =====
                this.preOrderReservationId =
                result.reservationId || '';
                
                this.preOrderSuccess = true;
                
                
                // Release old screenshot preview from browser memory
                if (this.preOrderForm.proofPreview) {
                    URL.revokeObjectURL(
                        this.preOrderForm.proofPreview
                    );
                }
                
                
                // Reset customer form data
                this.preOrderForm = {
                    name: '',
                    contact: '',
                    location: '',
                    note: '',
                    website: '',
                    size: null,
                    quantity: 1,
                    proofFile: null,
                    proofPreview: ''
                };
                
            } catch (error) {
                
                console.error(
                    'PRE-ORDER SUBMISSION ERROR:',
                    error
                );
                
                this.preOrderError =
                error.message ||
                'Unable to submit your pre-order request. Please try again.';
                
            } finally {
                
                this.isPreOrderSubmitting = false;
                
            }
            
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
            this.categories = [
                'All',
                'HOT',
                'SALE',
                ...(this.config.categories || [])
            ];
        },
        
        get filteredProducts() {
            return this.products.filter(product => {
                
                // FALSE = completely hidden from storefront
                const isActive =
                product.active !== false;
                
                const matchesCategory =
                this.selectedCategory === 'All' ||
                
                (
                    this.selectedCategory === 'HOT' &&
                    product.hot === true
                ) ||
                
                (
                    this.selectedCategory === 'SALE' &&
                    Number(product.discountAmount || 0) > 0
                ) ||
                
                product.category === this.selectedCategory;
                
                const matchesSearch = product.name
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase());
                
                return (
                    isActive &&
                    matchesCategory &&
                    matchesSearch
                );
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
        
        // ===== PRODUCT DISCOUNT HELPERS =====
        
        hasProductDiscount(product) {
            if (!product) return false;
            
            const regularPrice = Number(product.price) || 0;
            const discountAmount = Number(product.discountAmount) || 0;
            
            return (
                discountAmount > 0 &&
                discountAmount < regularPrice
            );
        },
        
        getProductFinalPrice(product) {
            if (!product) return 0;
            
            const regularPrice = Number(product.price) || 0;
            const discountAmount = Number(product.discountAmount) || 0;
            
            if (
                discountAmount > 0 &&
                discountAmount < regularPrice
            ) {
                return regularPrice - discountAmount;
            }
            
            return regularPrice;
        },
        
        selectProductSize(size) {
            
            this.selectedSize = size;
            
            // Clear old validation warning when changing size
            this.preOrderError = '';
            
            if (
                this.canPreOrderSize(
                    this.quickViewProduct,
                    size
                )
            ) {
                // Sold-out but allowed for pre-order
                this.preOrderForm.size = size;
                
            } else {
                
                // Available / non-preorder size
                // Close any previously opened pre-order form
                this.preOrderExpanded = false;
                this.preOrderForm.size = null;
                
            }
            
        },
        
        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        get cartTotal() {
            
            return this.cart.reduce((sum, item) => {
                
                const finalPrice = this.getProductFinalPrice(item);
                
                return sum + (finalPrice * item.quantity);
                
            }, 0);
            
        },
        
        // Same-day priority fee
        get sameDayPriorityFee() {
            return this.form.deliveryOption === 'same_day'
            ? 100
            : 0;
        },
        
        get grandTotal() {
            return this.cartTotal + this.sameDayPriorityFee;
        },
        
        addToCart(product, size = null) {
            
            // Products with sizes must have a selected size
            if (product.sizes && product.sizes.length && !size) {
                this.openQuickView(product);
                return;
            }
            
            // Never add a zero-stock size to the normal cart
            if (size && this.isSizeSoldOut(product, size)) {
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
            
            const email =
            this.form.email.trim();
            
            const contact =
            this.form.contact.replace(/[\s-]/g, '');
            
            const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            const phoneValid =
            /^(?:\+63|0)9\d{9}$/.test(contact);
            
            // ===== REQUIRED DETAILS =====
            if (
                !email ||
                !this.form.firstName.trim() ||
                !this.form.lastName.trim() ||
                !this.form.address.trim() ||
                !contact
            ) {
                this.showCheckoutNotice(
                    "Please complete all required checkout details first.",
                    "error"
                );
                return;
            }
            
            // ===== EMAIL =====
            if (!emailValid) {
                this.showCheckoutNotice(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }
            
            // ===== PHONE =====
            if (!phoneValid) {
                this.showCheckoutNotice(
                    "Please enter a valid Philippine mobile number.",
                    "error"
                );
                return;
            }
            
            // ===== PAYMENT METHOD =====
            if (
                this.form.deliveryOption !== 'same_day' &&
                !this.form.paymentMethod
            ) {
                this.showCheckoutNotice(
                    "Please select a payment method.",
                    "error"
                );
                return;
            }
            
            this.paymentModalOpen = true;
            
        },
        
        buildOrderSummary() {
            
            const email =
            this.form.email.trim();
            
            const contact =
            this.form.contact.replace(/[\s-]/g, '');
            
            const paymentLabel =
            this.form.deliveryOption === 'same_day'
            ? 'Payment arrangement via Messenger'
            : ({
                gcash: 'GCash',
                bank: 'Bank Transfer'
            }[this.form.paymentMethod] || this.form.paymentMethod);
            
            const deliveryLabel =
            this.form.deliveryOption === 'same_day'
            ? 'Same Day Delivery - PRIO'
            : 'Standard Delivery';
            
            let orderSummary =
            `NEW ORDER - ${this.config.storeName || 'Ulti'}\n\n`;
            
            orderSummary +=
`CUSTOMER DETAILS\n` +
`Name: ${this.form.firstName.trim()} ${this.form.lastName.trim()}\n` +
`Email: ${email}\n` +
`Phone: ${contact}\n` +
`Address: ${this.form.address.trim()}\n`;
            
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
                this.getProductFinalPrice(item) *
                Number(item.quantity);
                
                orderSummary +=
                `- ${item.name}${sizeText} | Qty: ${item.quantity} | ₱${lineTotal.toLocaleString()}\n`;
            });

            orderSummary +=
`\nSubtotal: ₱${this.cartTotal.toLocaleString()}`;
            
            if (this.form.deliveryOption === 'same_day') {
                orderSummary +=
                `\nPriority Fee: +₱${this.sameDayPriorityFee.toLocaleString()}`;
                
                orderSummary +=
                `\nDelivery Fee: To be confirmed via Messenger`;
            } else {
                orderSummary +=
                `\nDelivery Fee: To be confirmed via Messenger`;
            }
            
            orderSummary +=
`\nTOTAL BEFORE DELIVERY FEE: ₱${this.grandTotal.toLocaleString()}`;
            
            return orderSummary;
        },
        
        async submitOrder() {
            // ===== BASIC CHECKOUT VALIDATION =====
            const email = this.form.email.trim();
            
            const contact =
            this.form.contact.replace(/[\s-]/g, '');
            
            const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            const phoneValid =
            /^(?:\+63|0)9\d{9}$/.test(contact);
            
            if (
                !email ||
                !this.form.firstName.trim() ||
                !this.form.lastName.trim() ||
                !this.form.address.trim() ||
                !contact
            ) {
                this.showCheckoutNotice(
                    "Please complete all required checkout details.",
                    "error"
                );
                return;
            }
            
            if (!emailValid) {
                this.showCheckoutNotice(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }
            
            if (!phoneValid) {
                this.showCheckoutNotice(
                    "Please enter a valid Philippine mobile number.",
                    "error"
                );
                return;
            }
            
            // Same-day is arranged separately via Messenger / COD.
            if (
                this.form.deliveryOption !== 'same_day' &&
                !this.form.paymentMethod
            ) {
                this.showCheckoutNotice(
                    "Please select a payment method.",
                    "error"
                );
                return;
            }
            
            if (!this.cart.length) {
                this.showCheckoutNotice(
                    "Your cart is empty.",
                    "error"
                );
                return;
            }
            
            this.isSubmitting = true;
            
            // ===== ORDER SUMMARY =====
            const orderSummary =
            this.buildOrderSummary();
            
            // ===== MESSENGER =====
            const messengerBase = this.config.socials?.messenger;
            
            if (!messengerBase) {
                this.isSubmitting = false;
                this.showCheckoutNotice(
                    "Messenger link is not configured.",
                    "error"
                );
                return;
            }
            
            this.messengerLink =
            messengerBase +
            "?text=" +
            encodeURIComponent(orderSummary);
            this.preparedOrderDetails = orderSummary;
            
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
        
        async copyOrderDetails() {
            
            const email =
            this.form.email.trim();
            
            const contact =
            this.form.contact.replace(/[\s-]/g, '');
            
            const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            const phoneValid =
            /^(?:\+63|0)9\d{9}$/.test(contact);
            
            // ===== REQUIRED DETAILS =====
            if (
                !email ||
                !this.form.firstName.trim() ||
                !this.form.lastName.trim() ||
                !this.form.address.trim() ||
                !contact
            ) {
                this.showCheckoutNotice(
                    "Please complete all required checkout details first.",
                    "error"
                );
                return;
            }
            
            // ===== EMAIL =====
            if (!emailValid) {
                this.showCheckoutNotice(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }
            
            // ===== PHONE =====
            if (!phoneValid) {
                this.showCheckoutNotice(
                    "Please enter a valid Philippine mobile number.",
                    "error"
                );
                return;
            }
            
            // ===== PAYMENT METHOD =====
            if (
                this.form.deliveryOption !== 'same_day' &&
                !this.form.paymentMethod
            ) {
                this.showCheckoutNotice(
                    "Please select a payment method.",
                    "error"
                );
                return;
            }
            
            // ===== CART =====
            if (!this.cart.length) {
                this.showCheckoutNotice(
                    "Your cart is empty.",
                    "error"
                );
                return;
            }
            
            const orderDetails =
            this.buildOrderSummary();
            
            this.preparedOrderDetails =
            orderDetails;
            
            try {
                
                await navigator.clipboard.writeText(
                    orderDetails
                );
                
                this.showCheckoutNotice(
                    "Order details copied. You can paste them in Messenger.",
                    "success"
                );
                
            } catch (error) {
                
                this.showCheckoutNotice(
                    "Unable to copy automatically. Please try again.",
                    "error"
                );
                
            }
            
        },
        
        showCheckoutNotice(message, type = 'info') {
            
            // Cancel previous auto-hide timer
            if (this._checkoutNoticeTimer) {
                clearTimeout(this._checkoutNoticeTimer);
            }

            this.checkoutNotice.message = message;
            this.checkoutNotice.type = type;
            this.checkoutNotice.show = true;
            
            // Auto hide after 3 seconds
            this._checkoutNoticeTimer = setTimeout(() => {
                this.checkoutNotice.show = false;
            }, 3000);
            
        },
        
    }));
});