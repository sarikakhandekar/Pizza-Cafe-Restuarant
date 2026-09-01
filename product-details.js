// ============================================
// PRODUCT DETAILS - MAIN JAVASCRIPT
// FoodieExpress - Product Details Page
// ============================================

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        API_BASE_URL: '/api',
        CURRENCY: '₹',
        CURRENCY_CODE: 'INR',
        ITEMS_PER_PAGE: 5,
        DEBOUNCE_DELAY: 300,
        TOAST_DURATION: 3000,
        LOCAL_STORAGE_KEYS: {
            CART: 'foodie_cart',
            WISHLIST: 'foodie_wishlist',
            RECENT_PRODUCTS: 'foodie_recent',
            USER: 'foodie_user'
        }
    };

    // ============================================
    // SAMPLE DATA (Replace with API calls)
    // ============================================
    const SAMPLE_PRODUCT = {
        id: "987",
        name: "Margherita Pizza",
        slug: "margherita-pizza",
        tagline: "Classic Italian favorite with fresh basil",
        category: "pizza",
        categoryName: "Pizza",
        images: [
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop"
        ],
        description: "Our classic Margherita Pizza is made with hand-tossed dough, San Marzano tomato sauce, fresh mozzarella cheese, and aromatic basil leaves. Baked to perfection in our wood-fired oven, this pizza delivers an authentic Italian taste that will transport you straight to Naples. Each bite offers a perfect balance of tangy tomato, creamy cheese, and fragrant herbs.",
        price: 199,
        originalPrice: 249,
        currency: "INR",
        type: "veg",
        spiceLevel: "mild",
        rating: 4.5,
        reviewCount: 120,
        variants: [
            { id: "v1", name: "Regular (8\")", price: 199, available: true },
            { id: "v2", name: "Medium (10\")", price: 299, available: true },
            { id: "v3", name: "Large (12\")", price: 399, available: true },
            { id: "v4", name: "Family (14\")", price: 499, available: false }
        ],
        addons: [
            { id: "a1", name: "Extra Cheese", price: 30, maxQty: 3, category: "toppings" },
            { id: "a2", name: "Jalapenos", price: 20, maxQty: 2, category: "toppings" },
            { id: "a3", name: "Mushrooms", price: 25, maxQty: 2, category: "toppings" },
            { id: "a4", name: "Olives", price: 25, maxQty: 2, category: "toppings" },
            { id: "a5", name: "Garlic Bread", price: 49, maxQty: 3, category: "sides" },
            { id: "a6", name: "Cheesy Dip", price: 29, maxQty: 2, category: "sides" },
            { id: "a7", name: "Coca-Cola (300ml)", price: 40, maxQty: 5, category: "drinks" }
        ],
        ingredients: ["Wheat Flour", "Mozzarella Cheese", "Tomato Sauce", "Fresh Basil", "Olive Oil", "Salt", "Yeast"],
        allergens: ["Gluten", "Dairy"],
        nutrition: {
            calories: 350,
            fat: "12g",
            carbs: "42g",
            protein: "15g",
            fiber: "2g",
            sodium: "680mg"
        },
        availability: true,
        stockCount: 50,
        prepTimeMin: 20,
        prepTimeMax: 25,
        deliveryFee: 30,
        freeDeliveryAbove: 299,
        offers: [
            { code: "FIRST50", description: "50% off on first order", minOrder: 199 },
            { code: "COMBO20", description: "20% off on combos", minOrder: 399 }
        ],
        restaurant: {
            id: "r10",
            name: "Pizza House",
            logo: "🍕",
            rating: 4.3,
            reviewCount: 856,
            address: "123 Food Street, Flavor Town",
            openHours: "10:00 AM - 11:00 PM",
            deliveryTime: "30-45 min",
            isOpen: true
        },
        policies: {
            cancellable: true,
            cancellationWindow: "before preparation",
            refundable: true,
            refundWindow: "within 15 mins of delivery",
            replaceable: true
        },
        tags: ["bestseller", "chef-special"],
        keywords: ["pizza", "cheese", "italian", "vegetarian", "margherita"]
    };

    const SAMPLE_REVIEWS = {
        summary: {
            average: 4.5,
            total: 120,
            distribution: {
                5: 65,
                4: 35,
                3: 12,
                2: 5,
                1: 3
            }
        },
        reviews: [
            {
                id: "rev1",
                userId: "u1",
                userName: "Rahul S.",
                userAvatar: null,
                rating: 5,
                title: "Best pizza in town!",
                text: "Absolutely loved the Margherita! The crust was perfectly crispy and the cheese was so fresh. Will definitely order again.",
                date: "2024-01-15",
                helpful: 24,
                verified: true,
                images: []
            },
            {
                id: "rev2",
                userId: "u2",
                userName: "Priya M.",
                userAvatar: null,
                rating: 4,
                title: "Great taste, quick delivery",
                text: "Very tasty pizza with fresh ingredients. Delivery was faster than expected. Only wish the portion was slightly bigger.",
                date: "2024-01-12",
                helpful: 18,
                verified: true,
                images: []
            },
            {
                id: "rev3",
                userId: "u3",
                userName: "Amit K.",
                userAvatar: null,
                rating: 5,
                title: "Authentic Italian flavor",
                text: "This is as close to authentic Italian pizza as you can get! The basil is so fresh and aromatic. Highly recommended!",
                date: "2024-01-10",
                helpful: 15,
                verified: true,
                images: []
            },
            {
                id: "rev4",
                userId: "u4",
                userName: "Sneha R.",
                userAvatar: null,
                rating: 4,
                title: "Good quality",
                text: "Nice pizza, good quality ingredients. The crust could be a bit thinner for my taste, but overall a great meal.",
                date: "2024-01-08",
                helpful: 8,
                verified: false,
                images: []
            },
            {
                id: "rev5",
                userId: "u5",
                userName: "Vikram P.",
                userAvatar: null,
                rating: 5,
                title: "Family favorite!",
                text: "Ordered the family size for a party and everyone loved it! Great value for money.",
                date: "2024-01-05",
                helpful: 12,
                verified: true,
                images: []
            }
        ],
        pagination: {
            currentPage: 1,
            totalPages: 24,
            hasMore: true
        }
    };

    const SAMPLE_RELATED_PRODUCTS = [
        {
            id: "101",
            name: "Pepperoni Pizza",
            price: 299,
            originalPrice: 349,
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
            rating: 4.7,
            type: "non-veg",
            category: "pizza"
        },
        {
            id: "102",
            name: "BBQ Chicken Pizza",
            price: 349,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
            rating: 4.6,
            type: "non-veg",
            category: "pizza"
        },
        {
            id: "103",
            name: "Veggie Supreme",
            price: 279,
            originalPrice: 329,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
            rating: 4.4,
            type: "veg",
            category: "pizza"
        },
        {
            id: "104",
            name: "Cheese Burst Pizza",
            price: 329,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
            rating: 4.8,
            type: "veg",
            category: "pizza"
        },
        {
            id: "105",
            name: "Farmhouse Pizza",
            price: 269,
            originalPrice: 299,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
            rating: 4.3,
            type: "veg",
            category: "pizza"
        },
        {
            id: "106",
            name: "Paneer Tikka Pizza",
            price: 319,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
            rating: 4.5,
            type: "veg",
            category: "pizza"
        }
    ];

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const state = {
        product: null,
        reviews: null,
        relatedProducts: [],
        selectedVariant: null,
        selectedAddons: [],
        quantity: 1,
        currentImageIndex: 0,
        isLoading: true,
        hasError: false,
        isWishlisted: false,
        cart: [],
        wishlist: [],
        user: null,
        reviewRating: 0,
        currentReviewPage: 1,
        carouselPosition: 0
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {};

    function cacheElements() {
        elements.header = document.getElementById('header');
        elements.hamburger = document.getElementById('hamburger');
        elements.mobileMenu = document.getElementById('mobileMenu');
        elements.cartBtn = document.getElementById('cartBtn');
        elements.cartBadge = document.getElementById('cartBadge');
        elements.headerSearchInput = document.getElementById('headerSearchInput');
        
        // Breadcrumb
        elements.breadcrumbCategory = document.getElementById('breadcrumbCategory');
        elements.breadcrumbProduct = document.getElementById('breadcrumbProduct');
        
        // Gallery
        elements.productGallery = document.getElementById('productGallery');
        elements.mainImageContainer = document.getElementById('mainImageContainer');
        elements.thumbnailList = document.getElementById('thumbnailList');
        
        // Product Info
        elements.productInfo = document.getElementById('productInfo');
        elements.productMain = document.getElementById('productMain');
        
        // Tabs
        elements.tabsSection = document.getElementById('tabsSection');
        elements.tabBtns = document.querySelectorAll('.tab-btn');
        elements.tabContents = document.querySelectorAll('.tab-content');
        elements.descriptionText = document.getElementById('descriptionText');
        elements.ingredientsList = document.getElementById('ingredientsList');
        elements.allergenWarning = document.getElementById('allergenWarning');
        elements.allergenText = document.getElementById('allergenText');
        elements.nutritionGrid = document.getElementById('nutritionGrid');
        
        // Reviews
        elements.reviewsSummary = document.getElementById('reviewsSummary');
        elements.reviewsList = document.getElementById('reviewsList');
        elements.reviewsPagination = document.getElementById('reviewsPagination');
        elements.writeReviewBtn = document.getElementById('writeReviewBtn');
        elements.reviewForm = document.getElementById('reviewForm');
        elements.starRatingInput = document.getElementById('starRatingInput');
        elements.reviewText = document.getElementById('reviewText');
        elements.submitReviewBtn = document.getElementById('submitReviewBtn');
        elements.cancelReviewBtn = document.getElementById('cancelReviewBtn');
        
        // Related Products
        elements.relatedSection = document.getElementById('relatedSection');
        elements.productsCarousel = document.getElementById('productsCarousel');
        elements.carouselPrev = document.getElementById('carouselPrev');
        elements.carouselNext = document.getElementById('carouselNext');
        
        // Restaurant
        elements.restaurantSection = document.getElementById('restaurantSection');
        elements.restaurantLogo = document.getElementById('restaurantLogo');
        elements.restaurantName = document.getElementById('restaurantName');
        elements.restaurantRating = document.getElementById('restaurantRating');
        elements.restaurantDelivery = document.getElementById('restaurantDelivery');
        elements.restaurantDetails = document.getElementById('restaurantDetails');
        
        // Image Modal
        elements.imageModal = document.getElementById('imageModal');
        elements.modalImage = document.getElementById('modalImage');
        elements.modalClose = document.getElementById('modalClose');
        elements.modalPrev = document.getElementById('modalPrev');
        elements.modalNext = document.getElementById('modalNext');
        
        // Mobile Sticky Bar
        elements.mobileStickyBar = document.getElementById('mobileStickyBar');
        elements.stickyPrice = document.getElementById('stickyPrice');
        elements.stickyAddBtn = document.getElementById('stickyAddBtn');
        
        // Toast
        elements.toastContainer = document.getElementById('toastContainer');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '987'; // Default to sample product
    }

    function formatPrice(price) {
        return `${CONFIG.CURRENCY}${price.toLocaleString('en-IN')}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" class="star-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
        
        if (hasHalfStar) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-icon">
                <defs>
                    <linearGradient id="half-star">
                        <stop offset="50%" stop-color="#FFD700"/>
                        <stop offset="50%" stop-color="#DDD"/>
                    </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-star)" stroke="#FFD700"></polygon>
            </svg>`;
        }
        
        for (let i = 0; i < emptyStars; i++) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DDD" stroke="#DDD" class="star-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
        
        return html;
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.success}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });
        
        // Auto remove
        setTimeout(() => {
            removeToast(toast);
        }, CONFIG.TOAST_DURATION);
    }

    function removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }

    // ============================================
    // LOCAL STORAGE FUNCTIONS
    // ============================================
    
    function loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    }

    function saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }

    function loadCart() {
        state.cart = loadFromStorage(CONFIG.LOCAL_STORAGE_KEYS.CART) || [];
        updateCartBadge();
    }

    function saveCart() {
        saveToStorage(CONFIG.LOCAL_STORAGE_KEYS.CART, state.cart);
        updateCartBadge();
    }

    function loadWishlist() {
        state.wishlist = loadFromStorage(CONFIG.LOCAL_STORAGE_KEYS.WISHLIST) || [];
        updateWishlistState();
    }

    function saveWishlist() {
        saveToStorage(CONFIG.LOCAL_STORAGE_KEYS.WISHLIST, state.wishlist);
    }

    function loadUser() {
        state.user = loadFromStorage(CONFIG.LOCAL_STORAGE_KEYS.USER);
    }

    function updateCartBadge() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
        elements.cartBadge.textContent = totalItems;
        
        if (totalItems > 0) {
            elements.cartBadge.classList.add('show');
        } else {
            elements.cartBadge.classList.remove('show');
        }
    }

    function updateWishlistState() {
        if (state.product) {
            state.isWishlisted = state.wishlist.includes(state.product.id);
        }
    }

    // ============================================
    // API FUNCTIONS
    // ============================================
    
    async function fetchProduct(productId) {
        state.isLoading = true;
        state.hasError = false;
        
        try {
            // Simulate API call - Replace with actual fetch
            // const response = await fetch(`${CONFIG.API_BASE_URL}/products/${productId}`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
            
            state.product = SAMPLE_PRODUCT;
            state.isLoading = false;
            
            // Set default variant
            const availableVariant = state.product.variants.find(v => v.available);
            if (availableVariant) {
                state.selectedVariant = availableVariant;
            }
            
            // Track product view
            trackEvent('product_view', {
                productId: state.product.id,
                productName: state.product.name,
                category: state.product.category,
                price: state.product.price
            });
            
            // Add to recent products
            addToRecentProducts(state.product);
            
            return state.product;
            
        } catch (error) {
            console.error('Error fetching product:', error);
            state.isLoading = false;
            state.hasError = true;
            throw error;
        }
    }

    async function fetchReviews(productId, page = 1) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/products/${productId}/reviews?page=${page}`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            state.reviews = SAMPLE_REVIEWS;
            state.currentReviewPage = page;
            
            return state.reviews;
            
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    async function fetchRelatedProducts(category, excludeId) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/products?category=${category}&exclude=${excludeId}`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 600));
            
            state.relatedProducts = SAMPLE_RELATED_PRODUCTS;
            
            return state.relatedProducts;
            
        } catch (error) {
            console.error('Error fetching related products:', error);
            throw error;
        }
    }

    async function addToCartAPI(cartItem) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/cart`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(cartItem)
            // });
            // return await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return { success: true, cartItemId: Date.now().toString() };
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async function validateCoupon(code, orderTotal) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/coupons/validate`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ code, orderTotal })
            // });
            // return await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const coupon = state.product.offers.find(o => o.code === code.toUpperCase());
            
            if (coupon && orderTotal >= coupon.minOrder) {
                return {
                    valid: true,
                    discount: Math.floor(orderTotal * 0.2),
                    message: coupon.description
                };
            }
            
            return { valid: false, message: 'Invalid or expired coupon code' };
            
        } catch (error) {
            console.error('Error validating coupon:', error);
            throw error;
        }
    }

    async function submitReview(productId, reviewData) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/products/${productId}/reviews`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(reviewData)
            // });
            // return await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            return { success: true, reviewId: Date.now().toString() };
            
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    }

    async function toggleWishlistAPI(productId) {
        try {
            // Simulate API call
            // const response = await fetch(`${CONFIG.API_BASE_URL}/wishlist`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ productId })
            // });
            // return await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return { success: true };
            
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            throw error;
        }
    }

    // ============================================
    // RECENT PRODUCTS
    // ============================================
    
    function addToRecentProducts(product) {
        let recent = loadFromStorage(CONFIG.LOCAL_STORAGE_KEYS.RECENT_PRODUCTS) || [];
        
        // Remove if already exists
        recent = recent.filter(p => p.id !== product.id);
        
        // Add to beginning
        recent.unshift({
            id: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price
        });
        
        // Keep only last 10
        recent = recent.slice(0, 10);
        
        saveToStorage(CONFIG.LOCAL_STORAGE_KEYS.RECENT_PRODUCTS, recent);
    }

    // ============================================
    // ANALYTICS
    // ============================================
    
    function trackEvent(eventName, eventData) {
        console.log(`[Analytics] ${eventName}:`, eventData);
        
        // Send to analytics service
        // gtag('event', eventName, eventData);
        // or
        // window.dataLayer.push({ event: eventName, ...eventData });
    }

    // ============================================
    // SEO & META TAGS
    // ============================================
    
    function updateMetaTags(product) {
        // Update title
        document.title = `${product.name} - FoodieExpress`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = product.description.substring(0, 160);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.content = `${product.name} - FoodieExpress`;
        if (ogDesc) ogDesc.content = product.description.substring(0, 160);
        if (ogImage) ogImage.content = product.images[0];
        if (ogUrl) ogUrl.content = window.location.href;
        
        // Update Twitter Card
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        
        if (twitterTitle) twitterTitle.content = `${product.name} - FoodieExpress`;
        if (twitterDesc) twitterDesc.content = product.description.substring(0, 160);
        
        // Add JSON-LD structured data
        addStructuredData(product);
    }

    function addStructuredData(product) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images,
            "sku": product.id,
            "brand": {
                "@type": "Brand",
                "name": product.restaurant.name
            },
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": product.currency,
                "price": product.price,
                "availability": product.availability 
                    ? "https://schema.org/InStock" 
                    : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": product.restaurant.name
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount
            }
        };
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    
    function renderProduct() {
        const product = state.product;
        if (!product) return;
        
        // Update breadcrumb
        elements.breadcrumbCategory.textContent = product.categoryName;
        elements.breadcrumbCategory.href = `products.html?category=${product.category}`;
        elements.breadcrumbProduct.textContent = product.name;
        
        // Render gallery
        renderGallery();
        
        // Render product info
        renderProductInfo();
        
        // Render tabs content
        renderTabsContent();
        
        // Render restaurant info
        renderRestaurantInfo();
        
        // Update meta tags
        updateMetaTags(product);
    }

    function renderGallery() {
        const product = state.product;
        
        // Main image
        elements.mainImageContainer.innerHTML = `
            <img 
                src="${product.images[0]}" 
                alt="${product.name}" 
                class="main-image"
                id="mainImage"
                loading="lazy"
                srcset="${product.images[0]}?w=400 400w, ${product.images[0]}?w=800 800w"
                sizes="(max-width: 768px) 100vw, 50vw"
            >
            <button class="zoom-btn" id="zoomBtn" aria-label="Zoom image">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
            </button>
            ${product.originalPrice ? `
                <div class="discount-badge">
                    ${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
            ` : ''}
        `;
        
        // Thumbnails
        let thumbnailsHtml = '';
        product.images.forEach((image, index) => {
            thumbnailsHtml += `
                <button 
                    class="thumbnail ${index === 0 ? 'active' : ''}" 
                    data-index="${index}"
                    aria-label="View image ${index + 1}"
                >
                    <img src="${image}?w=100" alt="${product.name} - Image ${index + 1}" loading="lazy">
                </button>
            `;
        });
        elements.thumbnailList.innerHTML = thumbnailsHtml;
        
        // Add thumbnail click handlers
        elements.thumbnailList.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                changeMainImage(parseInt(thumb.dataset.index));
            });
        });
        
        // Add zoom button handler
        document.getElementById('zoomBtn').addEventListener('click', openImageModal);
    }

    function changeMainImage(index) {
        const product = state.product;
        state.currentImageIndex = index;
        
        const mainImage = document.getElementById('mainImage');
        mainImage.src = product.images[index];
        mainImage.srcset = `${product.images[index]}?w=400 400w, ${product.images[index]}?w=800 800w`;
        
        // Update active thumbnail
        elements.thumbnailList.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    function renderProductInfo() {
        const product = state.product;
        const discount = product.originalPrice 
            ? Math.round((1 - product.price / product.originalPrice) * 100) 
            : 0;
        const savings = product.originalPrice ? product.originalPrice - product.price : 0;
        
        elements.productInfo.innerHTML = `
            <!-- Product Header -->
            <div class="product-header">
                <div class="product-badges">
                    ${product.type === 'veg' 
                        ? '<span class="badge badge-veg">🟢 Veg</span>' 
                        : '<span class="badge badge-nonveg">🔴 Non-Veg</span>'}
                    ${product.tags.includes('bestseller') ? '<span class="badge badge-bestseller">🏆 Bestseller</span>' : ''}
                    ${product.tags.includes('chef-special') ? '<span class="badge badge-special">👨‍🍳 Chef\'s Special</span>' : ''}
                </div>
                <h1 class="product-title">${product.name}</h1>
                <p class="product-tagline">${product.tagline}</p>
                
                <div class="product-rating" id="productRating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-value">${product.rating}</span>
                    <span class="rating-count">(${product.reviewCount} reviews)</span>
                </div>
            </div>
            
            <!-- Price Section -->
            <div class="price-section">
                <div class="price-main">
                    <span class="current-price" id="currentPrice">${formatPrice(state.selectedVariant?.price || product.price)}</span>
                    ${product.originalPrice ? `
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                        <span class="savings-badge">Save ${formatPrice(savings)} (${discount}%)</span>
                    ` : ''}
                </div>
                <p class="price-note">Inclusive of all taxes</p>
            </div>
            
            <!-- Variants Section -->
            <div class="variants-section">
                <h3 class="section-label">Select Size <span class="required">*</span></h3>
                <div class="variants-grid" id="variantsGrid">
                    ${product.variants.map(variant => `
                        <button 
                            class="variant-btn ${variant.id === state.selectedVariant?.id ? 'active' : ''} ${!variant.available ? 'disabled' : ''}"
                            data-variant-id="${variant.id}"
                            ${!variant.available ? 'disabled' : ''}
                            aria-label="${variant.name} - ${formatPrice(variant.price)}${!variant.available ? ' - Out of stock' : ''}"
                        >
                            <span class="variant-name">${variant.name}</span>
                            <span class="variant-price">${formatPrice(variant.price)}</span>
                            ${!variant.available ? '<span class="variant-unavailable">Out of Stock</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Addons Section -->
            <div class="addons-section">
                <h3 class="section-label">Add Extras (Optional)</h3>
                
                <!-- Toppings -->
                <div class="addon-category">
                    <h4 class="addon-category-title">Extra Toppings</h4>
                    <div class="addons-list" id="toppingsAddons">
                        ${product.addons.filter(a => a.category === 'toppings').map(addon => `
                            <div class="addon-item" data-addon-id="${addon.id}">
                                <div class="addon-info">
                                    <span class="addon-name">${addon.name}</span>
                                    <span class="addon-price">+${formatPrice(addon.price)}</span>
                                </div>
                                <div class="addon-qty">
                                    <button class="qty-btn minus" data-addon-id="${addon.id}" aria-label="Decrease ${addon.name}">−</button>
                                    <span class="qty-value" id="addon-qty-${addon.id}">0</span>
                                    <button class="qty-btn plus" data-addon-id="${addon.id}" aria-label="Increase ${addon.name}">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Sides -->
                <div class="addon-category">
                    <h4 class="addon-category-title">Sides & Extras</h4>
                    <div class="addons-list" id="sidesAddons">
                        ${product.addons.filter(a => a.category === 'sides').map(addon => `
                            <div class="addon-item" data-addon-id="${addon.id}">
                                <div class="addon-info">
                                    <span class="addon-name">${addon.name}</span>
                                    <span class="addon-price">+${formatPrice(addon.price)}</span>
                                </div>
                                <div class="addon-qty">
                                    <button class="qty-btn minus" data-addon-id="${addon.id}" aria-label="Decrease ${addon.name}">−</button>
                                    <span class="qty-value" id="addon-qty-${addon.id}">0</span>
                                    <button class="qty-btn plus" data-addon-id="${addon.id}" aria-label="Increase ${addon.name}">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Drinks -->
                <div class="addon-category">
                    <h4 class="addon-category-title">Beverages</h4>
                    <div class="addons-list" id="drinksAddons">
                        ${product.addons.filter(a => a.category === 'drinks').map(addon => `
                            <div class="addon-item" data-addon-id="${addon.id}">
                                <div class="addon-info">
                                    <span class="addon-name">${addon.name}</span>
                                    <span class="addon-price">+${formatPrice(addon.price)}</span>
                                </div>
                                <div class="addon-qty">
                                    <button class="qty-btn minus" data-addon-id="${addon.id}" aria-label="Decrease ${addon.name}">−</button>
                                    <span class="qty-value" id="addon-qty-${addon.id}">0</span>
                                    <button class="qty-btn plus" data-addon-id="${addon.id}" aria-label="Increase ${addon.name}">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Quantity Section -->
            <div class="quantity-section">
                <h3 class="section-label">Quantity</h3>
                <div class="quantity-control">
                    <button class="qty-btn minus" id="qtyMinus" aria-label="Decrease quantity">−</button>
                    <span class="qty-value" id="qtyValue">${state.quantity}</span>
                    <button class="qty-btn plus" id="qtyPlus" aria-label="Increase quantity">+</button>
                </div>
            </div>
            
            <!-- Total Section -->
            <div class="total-section">
                <div class="total-row">
                    <span class="total-label">Item Total</span>
                    <span class="total-value" id="itemTotal">${formatPrice(calculateTotal())}</span>
                </div>
                <div class="total-breakdown" id="totalBreakdown">
                    <!-- Breakdown will be rendered dynamically -->
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="btn-add-cart" id="addToCartBtn" ${!product.availability ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                </button>
                <button class="btn-buy-now" id="buyNowBtn" ${!product.availability ? 'disabled' : ''}>
                    Buy Now
                </button>
            </div>
            
            <!-- Secondary Actions -->
            <div class="secondary-actions">
                <button class="action-btn wishlist-btn ${state.isWishlisted ? 'active' : ''}" id="wishlistBtn" aria-label="${state.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${state.isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${state.isWishlisted ? 'Saved' : 'Save'}</span>
                </button>
                <div class="share-dropdown" id="shareDropdown">
                    <button class="action-btn share-btn" id="shareBtn" aria-label="Share product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        <span>Share</span>
                    </button>
                    <div class="share-options" id="shareOptions">
                        <button class="share-option" data-platform="whatsapp">
                            <span class="share-icon">📱</span> WhatsApp
                        </button>
                        <button class="share-option" data-platform="facebook">
                            <span class="share-icon">📘</span> Facebook
                        </button>
                        <button class="share-option" data-platform="twitter">
                            <span class="share-icon">🐦</span> Twitter
                        </button>
                        <button class="share-option" data-platform="copy">
                            <span class="share-icon">🔗</span> Copy Link
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Availability & Delivery -->
            <div class="delivery-info">
                <div class="availability ${product.availability ? 'in-stock' : 'out-of-stock'}">
                    ${product.availability 
                        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                           <span>In Stock</span>
                           ${product.stockCount <= 10 ? `<span class="low-stock">(Only ${product.stockCount} left!)</span>` : ''}`
                        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                           <span>Out of Stock</span>`
                    }
                </div>
                <div class="delivery-estimate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Delivery in <strong>${product.prepTimeMin}-${product.prepTimeMax} mins</strong></span>
                </div>
                <div class="delivery-fee">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <span>Delivery: ${formatPrice(product.deliveryFee)} | Free above ${formatPrice(product.freeDeliveryAbove)}</span>
                </div>
            </div>
            
            <!-- Offers -->
            <div class="offers-section">
                <h3 class="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect x="2" y="7" width="20" height="5"></rect>
                        <line x1="12" y1="22" x2="12" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                    Available Offers
                </h3>
                <div class="offers-list">
                    ${product.offers.map(offer => `
                        <div class="offer-item">
                            <span class="offer-code">${offer.code}</span>
                            <span class="offer-desc">${offer.description}</span>
                            <span class="offer-min">Min. order: ${formatPrice(offer.minOrder)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="coupon-input">
                    <input type="text" id="couponInput" placeholder="Enter coupon code">
                    <button class="btn-apply-coupon" id="applyCouponBtn">Apply</button>
                </div>
            </div>
            
            <!-- Food Info -->
            <div class="food-info">
                <div class="info-item">
                    <span class="info-icon">${product.type === 'veg' ? '🥬' : '🍖'}</span>
                    <span class="info-text">${product.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🌶️</span>
                    <span class="info-text">Spice: ${product.spiceLevel.charAt(0).toUpperCase() + product.spiceLevel.slice(1)}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">⏱️</span>
                    <span class="info-text">Prep: ${product.prepTimeMin}-${product.prepTimeMax} min</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🔥</span>
                    <span class="info-text">${product.nutrition.calories} cal</span>
                </div>
            </div>
        `;
        
        // Add event listeners after rendering
        addProductInfoEventListeners();
    }

    function addProductInfoEventListeners() {
        const product = state.product;
        
        // Variant selection
        document.querySelectorAll('.variant-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const variantId = btn.dataset.variantId;
                const variant = product.variants.find(v => v.id === variantId);
                
                if (variant) {
                    state.selectedVariant = variant;
                    
                    // Update UI
                    document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    updatePriceDisplay();
                }
            });
        });
        
        // Addon quantity buttons
        document.querySelectorAll('.addon-qty .qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const addonId = btn.dataset.addonId;
                const addon = product.addons.find(a => a.id === addonId);
                const qtyElement = document.getElementById(`addon-qty-${addonId}`);
                let currentQty = parseInt(qtyElement.textContent);
                
                if (btn.classList.contains('plus')) {
                    if (currentQty < addon.maxQty) {
                        currentQty++;
                    }
                } else {
                    if (currentQty > 0) {
                        currentQty--;
                    }
                }
                
                qtyElement.textContent = currentQty;
                
                // Update selected addons
                updateSelectedAddons(addonId, currentQty);
                updatePriceDisplay();
            });
        });
        
        // Main quantity controls
        document.getElementById('qtyMinus').addEventListener('click', () => {
            if (state.quantity > 1) {
                state.quantity--;
                document.getElementById('qtyValue').textContent = state.quantity;
                updatePriceDisplay();
            }
        });
        
        document.getElementById('qtyPlus').addEventListener('click', () => {
            if (state.quantity < 10) {
                state.quantity++;
                document.getElementById('qtyValue').textContent = state.quantity;
                updatePriceDisplay();
            }
        });
        
        // Add to cart
        document.getElementById('addToCartBtn').addEventListener('click', handleAddToCart);
        
        // Buy now
        document.getElementById('buyNowBtn').addEventListener('click', handleBuyNow);
        
        // Wishlist
        document.getElementById('wishlistBtn').addEventListener('click', handleWishlistToggle);
        
        // Share dropdown
        document.getElementById('shareBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('shareDropdown').classList.toggle('active');
        });
        
        // Share options
        document.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', () => {
                handleShare(option.dataset.platform);
                document.getElementById('shareDropdown').classList.remove('active');
            });
        });
        
        // Close share dropdown when clicking outside
        document.addEventListener('click', () => {
            document.getElementById('shareDropdown').classList.remove('active');
        });
        
        // Rating click to scroll to reviews
        document.getElementById('productRating').addEventListener('click', () => {
            document.querySelector('[data-tab="reviews"]').click();
            document.getElementById('tab-reviews').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Apply coupon
        document.getElementById('applyCouponBtn').addEventListener('click', handleApplyCoupon);
        document.getElementById('couponInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleApplyCoupon();
            }
        });
    }

    function updateSelectedAddons(addonId, qty) {
        const existingIndex = state.selectedAddons.findIndex(a => a.id === addonId);
        
        if (qty > 0) {
            if (existingIndex >= 0) {
                state.selectedAddons[existingIndex].qty = qty;
            } else {
                const addon = state.product.addons.find(a => a.id === addonId);
                state.selectedAddons.push({ ...addon, qty });
            }
        } else {
            if (existingIndex >= 0) {
                state.selectedAddons.splice(existingIndex, 1);
            }
        }
    }

    function calculateTotal() {
        if (!state.selectedVariant) return 0;
        
        const basePrice = state.selectedVariant.price;
        const addonsTotal = state.selectedAddons.reduce((sum, addon) => {
            return sum + (addon.price * addon.qty);
        }, 0);
        
        return (basePrice + addonsTotal) * state.quantity;
    }

    function updatePriceDisplay() {
        const total = calculateTotal();
        
        // Update main price display
        document.getElementById('currentPrice').textContent = formatPrice(state.selectedVariant?.price || state.product.price);
        document.getElementById('itemTotal').textContent = formatPrice(total);
        
        // Update sticky bar price
        elements.stickyPrice.textContent = formatPrice(total);
        
        // Update breakdown
        renderPriceBreakdown();
    }

    function renderPriceBreakdown() {
        const breakdownEl = document.getElementById('totalBreakdown');
        if (!breakdownEl) return;
        
        let html = '';
        
        if (state.selectedVariant) {
            html += `
                <div class="breakdown-item">
                    <span>${state.selectedVariant.name} × ${state.quantity}</span>
                    <span>${formatPrice(state.selectedVariant.price * state.quantity)}</span>
                </div>
            `;
        }
        
        if (state.selectedAddons.length > 0) {
            state.selectedAddons.forEach(addon => {
                html += `
                    <div class="breakdown-item addon">
                        <span>${addon.name} × ${addon.qty}</span>
                        <span>+${formatPrice(addon.price * addon.qty * state.quantity)}</span>
                    </div>
                `;
            });
        }
        
        breakdownEl.innerHTML = html;
    }

    function renderTabsContent() {
        const product = state.product;
        
        // Description
        elements.descriptionText.textContent = product.description;
        
        // Ingredients
        elements.ingredientsList.innerHTML = product.ingredients.map(ing => `
            <span class="ingredient-tag">${ing}</span>
        `).join('');
        
        // Allergens
        if (product.allergens && product.allergens.length > 0) {
            elements.allergenWarning.style.display = 'flex';
            elements.allergenText.textContent = `Contains: ${product.allergens.join(', ')}`;
        }
        
        // Nutrition
        elements.nutritionGrid.innerHTML = Object.entries(product.nutrition).map(([key, value]) => `
            <div class="nutrition-item">
                <span class="nutrition-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span class="nutrition-value">${value}</span>
            </div>
        `).join('');
    }

    function renderReviews() {
        if (!state.reviews) return;
        
        const { summary, reviews, pagination } = state.reviews;
        
        // Summary
        elements.reviewsSummary.innerHTML = `
            <div class="reviews-overall">
                <div class="overall-rating">
                    <span class="rating-number">${summary.average}</span>
                    <div class="rating-stars">${generateStars(summary.average)}</div>
                    <span class="rating-total">${summary.total} reviews</span>
                </div>
                <div class="rating-bars">
                    ${[5, 4, 3, 2, 1].map(star => {
                        const count = summary.distribution[star];
                        const percentage = (count / summary.total) * 100;
                        return `
                            <div class="rating-bar-row">
                                <span class="bar-label">${star} ★</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="bar-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Reviews list
        elements.reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.userAvatar 
                                ? `<img src="${review.userAvatar}" alt="${review.userName}">` 
                                : review.userName.charAt(0)}
                        </div>
                        <div class="reviewer-details">
                            <span class="reviewer-name">
                                ${review.userName}
                                ${review.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                            </span>
                            <span class="review-date">${formatDate(review.date)}</span>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
                <p class="review-text">${review.text}</p>
                ${review.images && review.images.length > 0 ? `
                    <div class="review-images">
                        ${review.images.map(img => `<img src="${img}" alt="Review image">`).join('')}
                    </div>
                ` : ''}
                <div class="review-actions">
                    <button class="helpful-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        `).join('');
        
        // Pagination
        if (pagination.totalPages > 1) {
            renderReviewsPagination(pagination);
        }
    }

    function renderReviewsPagination(pagination) {
        let html = '';
        
        if (pagination.currentPage > 1) {
            html += `<button class="pagination-btn" data-page="${pagination.currentPage - 1}">← Prev</button>`;
        }
        
        for (let i = 1; i <= Math.min(5, pagination.totalPages); i++) {
            html += `<button class="pagination-btn ${i === pagination.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        if (pagination.currentPage < pagination.totalPages) {
            html += `<button class="pagination-btn" data-page="${pagination.currentPage + 1}">Next →</button>`;
        }
        
        elements.reviewsPagination.innerHTML = html;
        
        // Add click handlers
        elements.reviewsPagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                loadReviewsPage(page);
            });
        });
    }

    async function loadReviewsPage(page) {
        try {
            await fetchReviews(state.product.id, page);
            renderReviews();
            elements.reviewsSummary.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            showToast('Failed to load reviews', 'error');
        }
    }

    function renderRelatedProducts() {
        if (!state.relatedProducts || state.relatedProducts.length === 0) {
            elements.relatedSection.style.display = 'none';
            return;
        }
        
        elements.productsCarousel.innerHTML = state.relatedProducts.map(product => `
            <a href="product-details.html?id=${product.id}" class="product-card">
                <div class="card-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.type === 'veg' 
                        ? '<span class="type-badge veg">🟢</span>' 
                        : '<span class="type-badge non-veg">🔴</span>'}
                </div>
                <div class="card-content">
                    <h4 class="card-title">${product.name}</h4>
                    <div class="card-rating">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>${product.rating}</span>
                    </div>
                    <div class="card-price">
                        <span class="current">${formatPrice(product.price)}</span>
                        ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                </div>
            </a>
        `).join('');
    }

    function renderRestaurantInfo() {
        const restaurant = state.product.restaurant;
        
        elements.restaurantLogo.textContent = restaurant.logo;
        elements.restaurantName.textContent = restaurant.name;
        elements.restaurantRating.querySelector('span:last-child').textContent = restaurant.rating;
        elements.restaurantDelivery.querySelector('span:last-child').textContent = restaurant.deliveryTime;
        
        elements.restaurantDetails.innerHTML = `
            <div class="restaurant-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${restaurant.address}</span>
            </div>
            <div class="restaurant-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${restaurant.openHours}</span>
                <span class="status-badge ${restaurant.isOpen ? 'open' : 'closed'}">${restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
            </div>
            <div class="restaurant-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${restaurant.reviewCount} reviews</span>
            </div>
        `;
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    async function handleAddToCart() {
        if (!state.selectedVariant) {
            showToast('Please select a size', 'warning');
            return;
        }
        
        if (!state.product.availability) {
            showToast('This item is currently unavailable', 'error');
            return;
        }
        
        const cartItem = {
            productId: state.product.id,
            productName: state.product.name,
            productImage: state.product.images[0],
            variantId: state.selectedVariant.id,
            variantName: state.selectedVariant.name,
            addons: state.selectedAddons.map(a => ({
                id: a.id,
                name: a.name,
                qty: a.qty,
                price: a.price
            })),
            qty: state.quantity,
            priceAtTime: calculateTotal(),
            unitPrice: state.selectedVariant.price,
            addedAt: new Date().toISOString()
        };
        
        try {
            // Try API first
            await addToCartAPI(cartItem);
            
            // Update local cart
            const existingIndex = state.cart.findIndex(item => 
                item.productId === cartItem.productId && 
                item.variantId === cartItem.variantId &&
                JSON.stringify(item.addons) === JSON.stringify(cartItem.addons)
            );
            
            if (existingIndex >= 0) {
                state.cart[existingIndex].qty += cartItem.qty;
                state.cart[existingIndex].priceAtTime = calculateTotal();
            } else {
                state.cart.push(cartItem);
            }
            
            saveCart();
            
            // Track event
            trackEvent('add_to_cart', {
                productId: state.product.id,
                productName: state.product.name,
                variant: state.selectedVariant.name,
                addons: state.selectedAddons.map(a => a.name),
                qty: state.quantity,
                price: calculateTotal()
            });
            
            showToast(`${state.product.name} added to cart!`, 'success');
            
            // Animate button
            const btn = document.getElementById('addToCartBtn');
            btn.classList.add('added');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added!
            `;
            
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                `;
            }, 2000);
            
        } catch (error) {
            showToast('Failed to add to cart', 'error');
        }
    }

    async function handleBuyNow() {
        if (!state.selectedVariant) {
            showToast('Please select a size', 'warning');
            return;
        }
        
        if (!state.product.availability) {
            showToast('This item is currently unavailable', 'error');
            return;
        }
        
        // Track event
        trackEvent('begin_checkout', {
            productId: state.product.id,
            productName: state.product.name,
            variant: state.selectedVariant.name,
            price: calculateTotal()
        });
        
        // Save selection to session storage for checkout
        const checkoutItem = {
            productId: state.product.id,
            productName: state.product.name,
            productImage: state.product.images[0],
            variantId: state.selectedVariant.id,
            variantName: state.selectedVariant.name,
            addons: state.selectedAddons,
            qty: state.quantity,
            priceAtTime: calculateTotal()
        };
        
        sessionStorage.setItem('foodie_checkout_item', JSON.stringify(checkoutItem));
        
        // Redirect to checkout
        window.location.href = 'checkout.html?mode=buynow';
    }

    async function handleWishlistToggle() {
        try {
            await toggleWishlistAPI(state.product.id);
            
            state.isWishlisted = !state.isWishlisted;
            
            if (state.isWishlisted) {
                state.wishlist.push(state.product.id);
            } else {
                state.wishlist = state.wishlist.filter(id => id !== state.product.id);
            }
            
            saveWishlist();
            
            // Update UI
            const btn = document.getElementById('wishlistBtn');
            btn.classList.toggle('active', state.isWishlisted);
            btn.querySelector('svg').setAttribute('fill', state.isWishlisted ? 'currentColor' : 'none');
            btn.querySelector('span').textContent = state.isWishlisted ? 'Saved' : 'Save';
            
            // Track event
            trackEvent('wishlist_toggle', {
                productId: state.product.id,
                productName: state.product.name,
                action: state.isWishlisted ? 'add' : 'remove'
            });
            
            showToast(
                state.isWishlisted ? 'Added to wishlist!' : 'Removed from wishlist',
                'success'
            );
            
        } catch (error) {
            showToast('Failed to update wishlist', 'error');
        }
    }

    function handleShare(platform) {
        const url = window.location.href;
        const title = `${state.product.name} - FoodieExpress`;
        const text = `Check out ${state.product.name} on FoodieExpress!`;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    showToast('Link copied to clipboard!', 'success');
                }).catch(() => {
                    showToast('Failed to copy link', 'error');
                });
                
                trackEvent('share_product', {
                    productId: state.product.id,
                    platform: 'copy'
                });
                return;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            
            trackEvent('share_product', {
                productId: state.product.id,
                platform
            });
        }
    }

    async function handleApplyCoupon() {
        const code = document.getElementById('couponInput').value.trim();
        
        if (!code) {
            showToast('Please enter a coupon code', 'warning');
            return;
        }
        
        try {
            const result = await validateCoupon(code, calculateTotal());
            
            if (result.valid) {
                showToast(`Coupon applied! ${result.message}`, 'success');
                
                trackEvent('apply_coupon', {
                    code,
                    discount: result.discount,
                    success: true
                });
            } else {
                showToast(result.message, 'error');
                
                trackEvent('apply_coupon', {
                    code,
                    success: false
                });
            }
            
        } catch (error) {
            showToast('Failed to validate coupon', 'error');
        }
    }

    async function handleSubmitReview() {
        if (state.reviewRating === 0) {
            showToast('Please select a rating', 'warning');
            return;
        }
        
        const text = elements.reviewText.value.trim();
        if (!text) {
            showToast('Please write a review', 'warning');
            return;
        }
        
        try {
            await submitReview(state.product.id, {
                rating: state.reviewRating,
                text
            });
            
            showToast('Thank you for your review!', 'success');
            
            // Reset form
            state.reviewRating = 0;
            elements.reviewText.value = '';
            elements.starRatingInput.querySelectorAll('svg').forEach(star => {
                star.classList.remove('active');
            });
            elements.reviewForm.classList.remove('active');
            
            // Reload reviews
            await fetchReviews(state.product.id, 1);
            renderReviews();
            
        } catch (error) {
            showToast('Failed to submit review', 'error');
        }
    }

    // ============================================
    // IMAGE MODAL
    // ============================================
    
    function openImageModal() {
        elements.imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModalImage();
    }

    function closeImageModal() {
        elements.imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModalImage() {
        elements.modalImage.src = state.product.images[state.currentImageIndex];
        elements.modalImage.alt = state.product.name;
    }

    function nextModalImage() {
        state.currentImageIndex = (state.currentImageIndex + 1) % state.product.images.length;
        updateModalImage();
        changeMainImage(state.currentImageIndex);
    }

    function prevModalImage() {
        state.currentImageIndex = (state.currentImageIndex - 1 + state.product.images.length) % state.product.images.length;
        updateModalImage();
        changeMainImage(state.currentImageIndex);
    }

    // ============================================
    // CAROUSEL
    // ============================================
    
    function initCarousel() {
        let currentPosition = 0;
        const cardWidth = 280;
        const gap = 20;
        
        elements.carouselPrev.addEventListener('click', () => {
            if (currentPosition < 0) {
                currentPosition += cardWidth + gap;
                elements.productsCarousel.style.transform = `translateX(${currentPosition}px)`;
            }
        });
        
        elements.carouselNext.addEventListener('click', () => {
            const maxScroll = -(state.relatedProducts.length * (cardWidth + gap) - elements.productsCarousel.parentElement.offsetWidth);
            if (currentPosition > maxScroll) {
                currentPosition -= cardWidth + gap;
                elements.productsCarousel.style.transform = `translateX(${currentPosition}px)`;
            }
        });
    }

    // ============================================
    // TAB FUNCTIONALITY
    // ============================================
    
    function initTabs() {
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Update buttons
                elements.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update content
                elements.tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${tabId}`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // ============================================
    // HEADER FUNCTIONALITY
    // ============================================
    
    function initHeader() {
        // Sticky header
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        elements.hamburger.addEventListener('click', () => {
            elements.hamburger.classList.toggle('active');
            elements.mobileMenu.classList.toggle('active');
            elements.hamburger.setAttribute('aria-expanded', 
                elements.hamburger.classList.contains('active'));
        });
        
        // Cart button
        elements.cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
        
        // Header search
        elements.headerSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = `products.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // ============================================
    // MOBILE STICKY BAR
    // ============================================
    
    function initMobileStickyBar() {
        // Show/hide based on scroll
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const productSection = elements.productMain.getBoundingClientRect();
            
            if (productSection.bottom < 0) {
                elements.mobileStickyBar.classList.add('visible');
            } else {
                elements.mobileStickyBar.classList.remove('visible');
            }
            
            lastScroll = currentScroll;
        });
        
        // Add to cart from sticky bar
        elements.stickyAddBtn.addEventListener('click', handleAddToCart);
    }

    // ============================================
    // REVIEWS UI
    // ============================================
    
    function initReviewsUI() {
        // Write review button
        elements.writeReviewBtn.addEventListener('click', () => {
            elements.reviewForm.classList.toggle('active');
        });
        
        // Cancel review
        elements.cancelReviewBtn.addEventListener('click', () => {
            elements.reviewForm.classList.remove('active');
            state.reviewRating = 0;
            elements.reviewText.value = '';
            elements.starRatingInput.querySelectorAll('svg').forEach(star => {
                star.classList.remove('active');
            });
        });
        
        // Star rating input
        elements.starRatingInput.querySelectorAll('svg').forEach(star => {
            star.addEventListener('click', () => {
                state.reviewRating = parseInt(star.dataset.star);
                
                elements.starRatingInput.querySelectorAll('svg').forEach((s, i) => {
                    if (i < state.reviewRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.star);
                elements.starRatingInput.querySelectorAll('svg').forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                elements.starRatingInput.querySelectorAll('svg').forEach(s => {
                    s.classList.remove('hover');
                });
            });
        });
        
        // Submit review
        elements.submitReviewBtn.addEventListener('click', handleSubmitReview);
    }

    // ============================================
    // IMAGE MODAL EVENTS
    // ============================================
    
    function initImageModal() {
        elements.modalClose.addEventListener('click', closeImageModal);
        elements.modalPrev.addEventListener('click', prevModalImage);
        elements.modalNext.addEventListener('click', nextModalImage);
        
        elements.imageModal.addEventListener('click', (e) => {
            if (e.target === elements.imageModal) {
                closeImageModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (elements.imageModal.classList.contains('active')) {
                if (e.key === 'Escape') closeImageModal();
                if (e.key === 'ArrowLeft') prevModalImage();
                if (e.key === 'ArrowRight') nextModalImage();
            }
        });
    }

    // ============================================
    // ERROR STATE
    // ============================================
    
    function showError() {
        elements.productMain.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h2>Oops! Something went wrong</h2>
                <p>We couldn't load the product details. Please try again.</p>
                <button class="btn-retry" onclick="location.reload()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Try Again
                </button>
            </div>
        `;
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    async function init() {
        // Cache DOM elements
        cacheElements();
        
        // Load stored data
        loadCart();
        loadWishlist();
        loadUser();
        
        // Initialize UI components
        initHeader();
        initTabs();
        initImageModal();
        initMobileStickyBar();
        initReviewsUI();
        
        // Get product ID from URL
        const productId = getProductIdFromURL();
        
        try {
            // Fetch data
            await fetchProduct(productId);
            
            // Render product
            renderProduct();
            
            // Fetch and render reviews
            await fetchReviews(productId);
            renderReviews();
            
            // Fetch and render related products
            await fetchRelatedProducts(state.product.category, productId);
            renderRelatedProducts();
            initCarousel();
            
            // Initialize price display
            updatePriceDisplay();
            
        } catch (error) {
            console.error('Failed to initialize product page:', error);
            showError();
        }
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();