/* ============================================
   FOODIEEXPRESS - PIZZA PAGE JAVASCRIPT
   Complete Functionality for Pizza Menu
   ============================================ */

'use strict';

/* ============================================
   DOM ELEMENTS
   ============================================ */
const DOM = {
    // Navigation
    navbar: document.getElementById('navbar'),
    navLinks: document.getElementById('navLinks'),
    menuToggle: document.getElementById('menuToggle'),
    searchIcon: document.getElementById('searchIcon'),
    
    // Cart
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    emptyCart: document.getElementById('emptyCart'),
    cartFooter: document.getElementById('cartFooter'),
    subtotal: document.getElementById('subtotal'),
    delivery: document.getElementById('delivery'),
    total: document.getElementById('total'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Pizza Menu
    pizzaGrid: document.getElementById('pizzaGrid'),
    pizzaSearch: document.getElementById('pizzaSearch'),
    sortPizzas: document.getElementById('sortPizzas'),
    categoryTabs: document.querySelectorAll('.tab-btn'),
    pizzaCards: document.querySelectorAll('.pizza-card'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    
    // Other
    scrollTop: document.getElementById('scrollTop'),
    toastContainer: document.getElementById('toastContainer')
};

/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    deliveryFee: 2.99,
    freeDeliveryThreshold: 25,
    toastDuration: 3000,
    animationDuration: 300,
    storageKey: 'foodieExpressCart'
};

/* ============================================
   STATE MANAGEMENT
   ============================================ */
const State = {
    cart: [],
    wishlist: [],
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'popular',
    visiblePizzas: 12
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Format price to currency string
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */
const Toast = {
    show({ title, message, type = 'info', duration = CONFIG.toastDuration }) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            cart: 'fa-shopping-cart'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        DOM.toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide(toast));
        
        // Auto hide
        setTimeout(() => this.hide(toast), duration);
        
        return toast;
    },
    
    hide(toast) {
        if (!toast || toast.classList.contains('hiding')) return;
        
        toast.classList.add('hiding');
        toast.classList.remove('show');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }
};

/* ============================================
   LOCAL STORAGE MANAGEMENT
   ============================================ */
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = {
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSearch();
    },
    
    handleScroll() {
        const onScroll = throttle(() => {
            if (window.scrollY > 100) {
                DOM.navbar.classList.add('scrolled');
            } else {
                DOM.navbar.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', onScroll);
    },
    
    handleMobileMenu() {
        DOM.menuToggle?.addEventListener('click', () => {
            DOM.menuToggle.classList.toggle('active');
            DOM.navLinks.classList.toggle('active');
            document.body.style.overflow = DOM.navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                DOM.menuToggle.classList.remove('active');
                DOM.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!DOM.navbar.contains(e.target) && DOM.navLinks.classList.contains('active')) {
                DOM.menuToggle.classList.remove('active');
                DOM.navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    },
    
    handleSearch() {
        DOM.searchIcon?.addEventListener('click', () => {
            Toast.show({
                title: 'Search',
                message: 'Search functionality coming soon!',
                type: 'info'
            });
        });
    }
};

/* ============================================
   CART MANAGEMENT
   ============================================ */
const Cart = {
    init() {
        this.loadCart();
        this.bindEvents();
        this.updateUI();
    },
    
    loadCart() {
        const savedCart = Storage.load(CONFIG.storageKey);
        if (savedCart) {
            State.cart = savedCart;
        }
    },
    
    saveCart() {
        Storage.save(CONFIG.storageKey, State.cart);
    },
    
    bindEvents() {
        // Open cart
        DOM.cartIcon?.addEventListener('click', () => this.openCart());
        
        // Close cart
        DOM.closeCart?.addEventListener('click', () => this.closeCart());
        DOM.cartOverlay?.addEventListener('click', () => this.closeCart());
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.cartSidebar.classList.contains('open')) {
                this.closeCart();
            }
        });
        
        // Checkout button
        DOM.checkoutBtn?.addEventListener('click', () => this.checkout());
    },
    
    openCart() {
        DOM.cartSidebar.classList.add('open');
        DOM.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeCart() {
        DOM.cartSidebar.classList.remove('open');
        DOM.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    addItem(item) {
        // Check if item already exists with same size
        const existingIndex = State.cart.findIndex(
            cartItem => cartItem.id === item.id && cartItem.size === item.size
        );
        
        if (existingIndex > -1) {
            State.cart[existingIndex].quantity += 1;
        } else {
            State.cart.push({
                ...item,
                cartId: generateId(),
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateUI();
        this.animateCartIcon();
        
        Toast.show({
            title: 'Added to Cart!',
            message: `${item.name} (${item.size.toUpperCase()}) added`,
            type: 'cart'
        });
    },
    
    removeItem(cartId) {
        const index = State.cart.findIndex(item => item.cartId === cartId);
        
        if (index > -1) {
            const item = State.cart[index];
            State.cart.splice(index, 1);
            
            this.saveCart();
            this.updateUI();
            
            Toast.show({
                title: 'Removed',
                message: `${item.name} removed from cart`,
                type: 'info'
            });
        }
    },
    
    updateQuantity(cartId, change) {
        const item = State.cart.find(item => item.cartId === cartId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeItem(cartId);
            } else {
                this.saveCart();
                this.updateUI();
            }
        }
    },
    
    getSubtotal() {
        return State.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    getDeliveryFee() {
        const subtotal = this.getSubtotal();
        return subtotal >= CONFIG.freeDeliveryThreshold ? 0 : CONFIG.deliveryFee;
    },
    
    getTotal() {
        return this.getSubtotal() + this.getDeliveryFee();
    },
    
    getTotalItems() {
        return State.cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    updateUI() {
        // Update cart count
        const totalItems = this.getTotalItems();
        DOM.cartCount.textContent = totalItems;
        DOM.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        
        // Update cart items
        this.renderCartItems();
        
        // Update totals
        const subtotal = this.getSubtotal();
        const delivery = this.getDeliveryFee();
        const total = this.getTotal();
        
        DOM.subtotal.textContent = formatPrice(subtotal);
        DOM.delivery.textContent = delivery === 0 ? 'FREE' : formatPrice(delivery);
        DOM.delivery.className = delivery === 0 ? 'free-delivery' : '';
        DOM.total.textContent = formatPrice(total);
        
        // Show/hide empty cart message
        if (State.cart.length === 0) {
            DOM.emptyCart.style.display = 'block';
            DOM.cartFooter.style.display = 'none';
        } else {
            DOM.emptyCart.style.display = 'none';
            DOM.cartFooter.style.display = 'block';
        }
    },
    
    renderCartItems() {
        // Remove existing items (except empty cart message)
        const existingItems = DOM.cartItems.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());
        
        // Add cart items
        State.cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-size">Size: ${item.size.toUpperCase()}</span>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-cart-id="${item.cartId}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus" data-cart-id="${item.cartId}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" data-cart-id="${item.cartId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            // Insert before empty cart message
            DOM.cartItems.insertBefore(cartItemEl, DOM.emptyCart);
        });
        
        // Bind quantity controls
        this.bindQuantityControls();
    },
    
    bindQuantityControls() {
        // Minus buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateQuantity(btn.dataset.cartId, -1);
            });
        });
        
        // Plus buttons
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateQuantity(btn.dataset.cartId, 1);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.cartId);
            });
        });
    },
    
    animateCartIcon() {
        DOM.cartIcon.classList.add('bounce');
        setTimeout(() => {
            DOM.cartIcon.classList.remove('bounce');
        }, 500);
    },
    
    checkout() {
        if (State.cart.length === 0) {
            Toast.show({
                title: 'Cart is empty',
                message: 'Add some pizzas before checkout!',
                type: 'warning'
            });
            return;
        }
        
        Toast.show({
            title: 'Checkout',
            message: 'Redirecting to checkout...',
            type: 'success'
        });
        
        // Redirect to checkout (demo)
        setTimeout(() => {
            // window.location.href = 'checkout.html';
            console.log('Checkout with:', State.cart);
        }, 1500);
    }
};

/* ============================================
   PIZZA MENU FUNCTIONALITY
   ============================================ */
const PizzaMenu = {
    init() {
        this.bindCategoryTabs();
        this.bindSearch();
        this.bindSort();
        this.bindAddToCart();
        this.bindSizeSelection();
        this.bindWishlist();
        this.bindQuickView();
        this.bindLoadMore();
    },
    
    bindCategoryTabs() {
        DOM.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active state
                DOM.categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter pizzas
                State.currentCategory = tab.dataset.category;
                this.filterPizzas();
            });
        });
    },
    
    bindSearch() {
        DOM.pizzaSearch?.addEventListener('input', debounce((e) => {
            State.searchQuery = e.target.value.toLowerCase().trim();
            this.filterPizzas();
        }, 300));
    },
    
    bindSort() {
        DOM.sortPizzas?.addEventListener('change', (e) => {
            State.sortBy = e.target.value;
            this.sortPizzas();
        });
    },
    
    filterPizzas() {
        const cards = document.querySelectorAll('.pizza-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const category = card.dataset.category;
            const name = card.querySelector('.pizza-name').textContent.toLowerCase();
            const description = card.querySelector('.pizza-description').textContent.toLowerCase();
            
            const matchesCategory = State.currentCategory === 'all' || category === State.currentCategory;
            const matchesSearch = State.searchQuery === '' || 
                name.includes(State.searchQuery) || 
                description.includes(State.searchQuery);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
                card.style.animationDelay = `${visibleCount * 0.05}s`;
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide "no results" message
        this.toggleNoResults(visibleCount === 0);
    },
    
    sortPizzas() {
        const grid = DOM.pizzaGrid;
        const cards = Array.from(grid.querySelectorAll('.pizza-card'));
        
        cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const ratingA = parseFloat(a.dataset.rating);
            const ratingB = parseFloat(b.dataset.rating);
            
            switch (State.sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                case 'newest':
                    // For demo, just reverse order
                    return -1;
                default: // popular
                    return 0;
            }
        });
        
        // Re-append cards in new order
        cards.forEach((card, index) => {
            card.style.animation = 'fadeInUp 0.4s ease forwards';
            card.style.animationDelay = `${index * 0.05}s`;
            grid.appendChild(card);
        });
    },
    
    toggleNoResults(show) {
        let noResults = document.querySelector('.no-results');
        
        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <div class="no-results-icon">🍕</div>
                    <h3>No pizzas found</h3>
                    <p>Try adjusting your search or filter</p>
                    <button class="btn btn-primary" id="clearFilters">Clear Filters</button>
                `;
                DOM.pizzaGrid.appendChild(noResults);
                
                document.getElementById('clearFilters').addEventListener('click', () => {
                    State.searchQuery = '';
                    State.currentCategory = 'all';
                    DOM.pizzaSearch.value = '';
                    DOM.categoryTabs.forEach(t => t.classList.remove('active'));
                    document.querySelector('[data-category="all"]').classList.add('active');
                    this.filterPizzas();
                });
            }
        } else {
            if (noResults) {
                noResults.remove();
            }
        }
    },
    
    bindAddToCart() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const card = btn.closest('.pizza-card');
                const activeSize = card.querySelector('.size-btn.active');
                
                const item = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(activeSize.dataset.price),
                    size: activeSize.dataset.size,
                    image: card.querySelector('.card-image img').src
                };
                
                Cart.addItem(item);
                
                // Button animation
                this.animateAddButton(btn);
            });
        });
    },
    
    animateAddButton(btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
        btn.classList.add('added');
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('added');
        }, 1500);
    },
    
    bindSizeSelection() {
        document.querySelectorAll('.pizza-card').forEach(card => {
            const sizeBtns = card.querySelectorAll('.size-btn');
            const priceEl = card.querySelector('.current-price');
            const addBtn = card.querySelector('.add-to-cart-btn');
            
            sizeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active state
                    sizeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update price
                    const newPrice = btn.dataset.price;
                    priceEl.textContent = formatPrice(parseFloat(newPrice));
                    addBtn.dataset.price = newPrice;
                    
                    // Update card data attribute
                    card.dataset.price = newPrice;
                });
            });
        });
    },
    
    bindWishlist() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                
                if (btn.classList.contains('active')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#d63031';
                    
                    Toast.show({
                        title: 'Added to Wishlist',
                        message: 'Pizza saved to your favorites',
                        type: 'success'
                    });
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    
                    Toast.show({
                        title: 'Removed',
                        message: 'Removed from wishlist',
                        type: 'info'
                    });
                }
            });
        });
    },
    
    bindQuickView() {
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = btn.closest('.pizza-card');
                const name = card.querySelector('.pizza-name').textContent;
                
                Toast.show({
                    title: 'Quick View',
                    message: `${name} - Coming soon!`,
                    type: 'info'
                });
            });
        });
    },
    
    bindLoadMore() {
        DOM.loadMoreBtn?.addEventListener('click', () => {
            Toast.show({
                title: 'Loading...',
                message: 'More pizzas coming soon!',
                type: 'info'
            });
            
            // In a real app, this would load more items
            DOM.loadMoreBtn.innerHTML = '<span>No more pizzas</span>';
            DOM.loadMoreBtn.disabled = true;
        });
    }
};

/* ============================================
   DEALS SLIDER
   ============================================ */
const DealsSlider = {
    init() {
        this.slider = document.querySelector('.deals-slider');
        if (!this.slider) return;
        
        this.cards = this.slider.querySelectorAll('.deal-card');
        this.currentIndex = 0;
        
        if (this.cards.length > 1) {
            this.startAutoplay();
            this.addIndicators();
        }
    },
    
    startAutoplay() {
        setInterval(() => {
            this.next();
        }, 5000);
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateSlider();
    },
    
    updateSlider() {
        const offset = this.currentIndex * -100;
        this.slider.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.deal-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
        });
    },
    
    addIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'deal-indicators';
        
        this.cards.forEach((_, i) => {
            const indicator = document.createElement('button');
            indicator.className = `deal-indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => {
                this.currentIndex = i;
                this.updateSlider();
            });
            indicatorsContainer.appendChild(indicator);
        });
        
        this.slider.parentElement.appendChild(indicatorsContainer);
    }
};

/* ============================================
   SCROLL TO TOP
   ============================================ */
const ScrollToTop = {
    init() {
        this.handleVisibility();
        this.handleClick();
    },
    
    handleVisibility() {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                DOM.scrollTop?.classList.add('visible');
            } else {
                DOM.scrollTop?.classList.remove('visible');
            }
        }, 100));
    },
    
    handleClick() {
        DOM.scrollTop?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = DOM.navbar?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const floatingIngredients = document.querySelectorAll('.floating-ingredient');
    const ingredientIcons = document.querySelectorAll('.ingredient-icon');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        floatingIngredients.forEach((el, i) => {
            const speed = 0.1 + (i * 0.02);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, 16));
    
    // Mouse parallax for build section
    const buildSection = document.querySelector('.build-pizza');
    
    if (buildSection) {
        buildSection.addEventListener('mousemove', (e) => {
            const rect = buildSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            ingredientIcons.forEach((icon, i) => {
                const speed = (i + 1) * 15;
                icon.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
}

/* ============================================
   HERO ANIMATION
   ============================================ */
function initHeroAnimations() {
    const pizzaShowcase = document.querySelector('.pizza-showcase');
    const infoCards = document.querySelectorAll('.info-card');
    
    if (pizzaShowcase) {
        // Subtle rotation on mouse move
        document.querySelector('.pizza-hero')?.addEventListener('mousemove', (e) => {
            const rect = pizzaShowcase.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            
            pizzaShowcase.style.transform = `
                perspective(1000px)
                rotateY(${x * 5}deg)
                rotateX(${-y * 5}deg)
            `;
        });
        
        document.querySelector('.pizza-hero')?.addEventListener('mouseleave', () => {
            pizzaShowcase.style.transform = '';
        });
    }
}

/* ============================================
   RIPPLE EFFECT
   ============================================ */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .tab-btn, .add-to-cart-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .cart-icon.bounce {
                animation: bounce 0.5s ease;
            }
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Escape closes cart
        if (e.key === 'Escape') {
            if (DOM.cartSidebar.classList.contains('open')) {
                Cart.closeCart();
            }
        }
    });
}

/* ============================================
   INITIALIZE AOS
   ============================================ */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
}

/* ============================================
   PRICE ANIMATIONS
   ============================================ */
function initPriceAnimations() {
    // Animate prices when they come into view
    const priceElements = document.querySelectorAll('.current-price');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    priceElements.forEach(el => observer.observe(el));
}

/* ============================================
   INITIALIZE APPLICATION
   ============================================ */
function init() {
    // Core functionality
    Navigation.init();
    Cart.init();
    PizzaMenu.init();
    
    // UI enhancements
    ScrollToTop.init();
    DealsSlider.init();
    initSmoothScroll();
    initRippleEffect();
    initKeyboardNav();
    
    // Visual effects
    initParallax();
    initHeroAnimations();
    initLazyLoading();
    initPriceAnimations();
    
    // Initialize AOS
    initAOS();
    
    console.log('🍕 FoodieExpress Pizza Page initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ============================================
   EXPOSE API FOR EXTERNAL USE
   ============================================ */
window.FoodiePizza = {
    Cart,
    Toast,
    PizzaMenu,
    State
};