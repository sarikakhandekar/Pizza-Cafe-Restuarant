 // ============================================
        // SAMPLE PRODUCT DATA (Replace with API call)
        // ============================================
        const sampleProducts = [
            {
                id: 101,
                name: "Margherita Pizza",
                description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
                price: 199,
                originalPrice: 249,
                type: "pizza",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
                rating: 4.5,
                reviews: 128,
                prepTime: "20-25 min",
                popularity: 95,
                keywords: ["cheese", "vegetarian", "italian", "classic"]
            },
            {
                id: 102,
                name: "Pepperoni Pizza",
                description: "Loaded with spicy pepperoni and melted cheese",
                price: 299,
                originalPrice: 349,
                type: "pizza",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
                rating: 4.7,
                reviews: 256,
                prepTime: "20-25 min",
                popularity: 98,
                keywords: ["spicy", "meat", "italian", "popular"]
            },
            {
                id: 103,
                name: "Farmhouse Pizza",
                description: "Fresh vegetables, mushrooms, and olives on a crispy crust",
                price: 279,
                originalPrice: null,
                type: "pizza",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
                rating: 4.3,
                reviews: 89,
                prepTime: "25-30 min",
                popularity: 85,
                keywords: ["vegetarian", "healthy", "vegetables", "mushroom"]
            },
            {
                id: 104,
                name: "BBQ Chicken Pizza",
                description: "Smoky BBQ sauce with tender chicken and red onions",
                price: 349,
                originalPrice: 399,
                type: "pizza",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
                rating: 4.6,
                reviews: 167,
                prepTime: "25-30 min",
                popularity: 92,
                keywords: ["chicken", "bbq", "smoky", "non-veg"]
            },
            {
                id: 201,
                name: "Classic Cheeseburger",
                description: "Juicy beef patty with melted cheese, lettuce, and special sauce",
                price: 149,
                originalPrice: 179,
                type: "burger",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                rating: 4.4,
                reviews: 312,
                prepTime: "15-20 min",
                popularity: 94,
                keywords: ["beef", "cheese", "classic", "bestseller"]
            },
            {
                id: 202,
                name: "Double Bacon Burger",
                description: "Two beef patties with crispy bacon and cheddar cheese",
                price: 249,
                originalPrice: null,
                type: "burger",
                image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
                rating: 4.8,
                reviews: 198,
                prepTime: "15-20 min",
                popularity: 96,
                keywords: ["bacon", "double", "cheese", "premium"]
            },
            {
                id: 203,
                name: "Chicken Zinger Burger",
                description: "Crispy fried chicken with spicy mayo and fresh veggies",
                price: 179,
                originalPrice: 199,
                type: "burger",
                image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
                rating: 4.5,
                reviews: 234,
                prepTime: "12-18 min",
                popularity: 91,
                keywords: ["chicken", "crispy", "spicy", "zinger"]
            },
            {
                id: 204,
                name: "Veggie Supreme Burger",
                description: "Plant-based patty with avocado, tomato, and vegan sauce",
                price: 169,
                originalPrice: null,
                type: "burger",
                image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
                rating: 4.2,
                reviews: 76,
                prepTime: "15-20 min",
                popularity: 78,
                keywords: ["vegan", "vegetarian", "healthy", "plant-based"]
            },
            {
                id: 301,
                name: "Coca-Cola Classic",
                description: "Refreshing cola served ice cold",
                price: 49,
                originalPrice: null,
                type: "drinks",
                image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop",
                rating: 4.6,
                reviews: 456,
                prepTime: "2-3 min",
                popularity: 99,
                keywords: ["cola", "soda", "cold", "refreshing"]
            },
            {
                id: 302,
                name: "Fresh Orange Juice",
                description: "Freshly squeezed orange juice, no added sugar",
                price: 79,
                originalPrice: 99,
                type: "drinks",
                image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
                rating: 4.7,
                reviews: 189,
                prepTime: "5-7 min",
                popularity: 88,
                keywords: ["fresh", "healthy", "vitamin", "natural"]
            },
            {
                id: 303,
                name: "Mango Smoothie",
                description: "Creamy mango smoothie with yogurt and honey",
                price: 129,
                originalPrice: null,
                type: "drinks",
                image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
                rating: 4.8,
                reviews: 145,
                prepTime: "5-8 min",
                popularity: 93,
                keywords: ["mango", "smoothie", "creamy", "tropical"]
            },
            {
                id: 304,
                name: "Iced Coffee",
                description: "Cold brew coffee with cream and vanilla",
                price: 99,
                originalPrice: 119,
                type: "drinks",
                image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
                rating: 4.5,
                reviews: 267,
                prepTime: "3-5 min",
                popularity: 90,
                keywords: ["coffee", "cold", "caffeine", "vanilla"]
            },
            {
                id: 401,
                name: "French Fries",
                description: "Crispy golden fries with a side of ketchup",
                price: 79,
                originalPrice: null,
                type: "snacks",
                image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
                rating: 4.4,
                reviews: 378,
                prepTime: "8-12 min",
                popularity: 97,
                keywords: ["fries", "crispy", "potato", "side"]
            },
            {
                id: 402,
                name: "Chicken Wings",
                description: "Spicy buffalo wings with blue cheese dip",
                price: 199,
                originalPrice: 229,
                type: "snacks",
                image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
                rating: 4.6,
                reviews: 234,
                prepTime: "15-20 min",
                popularity: 94,
                keywords: ["wings", "spicy", "buffalo", "appetizer"]
            },
            {
                id: 403,
                name: "Mozzarella Sticks",
                description: "Crispy breaded mozzarella with marinara sauce",
                price: 149,
                originalPrice: null,
                type: "snacks",
                image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&h=300&fit=crop",
                rating: 4.3,
                reviews: 156,
                prepTime: "10-15 min",
                popularity: 86,
                keywords: ["cheese", "crispy", "appetizer", "vegetarian"]
            },
            {
                id: 404,
                name: "Onion Rings",
                description: "Crispy battered onion rings, perfectly golden",
                price: 89,
                originalPrice: 109,
                type: "snacks",
                image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
                rating: 4.2,
                reviews: 98,
                prepTime: "8-12 min",
                popularity: 82,
                keywords: ["onion", "crispy", "side", "appetizer"]
            },
            {
                id: 501,
                name: "Chocolate Brownie",
                description: "Rich, fudgy brownie topped with vanilla ice cream",
                price: 129,
                originalPrice: null,
                type: "desserts",
                image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
                rating: 4.7,
                reviews: 289,
                prepTime: "5-8 min",
                popularity: 95,
                keywords: ["chocolate", "sweet", "ice cream", "fudgy"]
            },
            {
                id: 502,
                name: "Cheesecake Slice",
                description: "New York style cheesecake with berry compote",
                price: 179,
                originalPrice: 199,
                type: "desserts",
                image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
                rating: 4.8,
                reviews: 176,
                prepTime: "3-5 min",
                popularity: 92,
                keywords: ["cheese", "sweet", "berries", "creamy"]
            },
            {
                id: 503,
                name: "Ice Cream Sundae",
                description: "Three scoops with chocolate sauce, nuts, and whipped cream",
                price: 149,
                originalPrice: null,
                type: "desserts",
                image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
                rating: 4.5,
                reviews: 234,
                prepTime: "5-7 min",
                popularity: 89,
                keywords: ["ice cream", "chocolate", "cold", "sweet"]
            },
            {
                id: 504,
                name: "Apple Pie",
                description: "Warm apple pie with cinnamon and vanilla custard",
                price: 139,
                originalPrice: 159,
                type: "desserts",
                image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop",
                rating: 4.4,
                reviews: 123,
                prepTime: "8-10 min",
                popularity: 84,
                keywords: ["apple", "warm", "cinnamon", "classic"]
            }
        ];

        // ============================================
        // APP STATE
        // ============================================
        const state = {
            products: [],
            filteredProducts: [],
            currentCategory: 'all',
            searchQuery: '',
            sortBy: 'default',
            currentPage: 1,
            itemsPerPage: 12,
            isLoading: false,
            hasError: false,
            cart: []
        };

        // ============================================
        // DOM ELEMENTS
        // ============================================
        const elements = {
            header: document.getElementById('header'),
            hamburger: document.getElementById('hamburger'),
            mobileMenu: document.getElementById('mobileMenu'),
            headerSearch: document.getElementById('headerSearch'),
            mobileSearch: document.getElementById('mobileSearch'),
            searchInput: document.getElementById('searchInput'),
            clearSearch: document.getElementById('clearSearch'),
            categoryBtns: document.querySelectorAll('.category-btn'),
            sortDropdown: document.getElementById('sortDropdown'),
            sortBtn: document.getElementById('sortBtn'),
            sortLabel: document.getElementById('sortLabel'),
            sortOptions: document.querySelectorAll('.sort-option'),
            productGrid: document.getElementById('productGrid'),
            skeletonLoader: document.getElementById('skeletonLoader'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            noResults: document.getElementById('noResults'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
            pagination: document.getElementById('pagination'),
            resultsCount: document.getElementById('resultsCount'),
            cartBtn: document.getElementById('cartBtn'),
            cartBadge: document.getElementById('cartBadge'),
            toastContainer: document.getElementById('toastContainer')
        };

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        
        // Debounce function
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

        // Format price
        function formatPrice(price) {
            return `₹${price}`;
        }

        // Generate skeleton cards
        function generateSkeletons(count = 8) {
            let html = '';
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="skeleton-card">
                        <div class="skeleton-image"></div>
                        <div class="skeleton-content">
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line short"></div>
                            <div class="skeleton-line price"></div>
                        </div>
                    </div>
                `;
            }
            return html;
        }

        // Show toast notification
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${type === 'success' 
                        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                    }
                </svg>
                <span class="toast-message">${message}</span>
                <button class="toast-close" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            elements.toastContainer.appendChild(toast);
            
            // Close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.remove();
            });
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ============================================
        // LOCAL STORAGE (Cart)
        // ============================================
        
        function loadCart() {
            const saved = localStorage.getItem('foodie_cart');
            state.cart = saved ? JSON.parse(saved) : [];
            updateCartBadge();
        }

        function saveCart() {
            localStorage.setItem('foodie_cart', JSON.stringify(state.cart));
        }

        function addToCart(productId) {
            const product = state.products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = state.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartBadge();
            showToast(`${product.name} added to cart!`);
            
            // Animate button
            const btn = document.querySelector(`[data-add-cart="${productId}"]`);
            if (btn) {
                btn.classList.add('added');
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added!
                `;
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                    `;
                }, 1500);
            }
        }

        function updateCartBadge() {
            const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            elements.cartBadge.textContent = totalItems;
            
            if (totalItems > 0) {
                elements.cartBadge.classList.add('show');
                elements.cartBadge.classList.add('pulse');
                setTimeout(() => elements.cartBadge.classList.remove('pulse'), 500);
            } else {
                elements.cartBadge.classList.remove('show');
            }
        }

        // ============================================
        // FETCH PRODUCTS
        // ============================================
        
        async function fetchProducts() {
            state.isLoading = true;
            state.hasError = false;
            
            // Show skeleton
            elements.skeletonLoader.innerHTML = generateSkeletons(8);
            elements.skeletonLoader.style.display = 'grid';
            elements.productGrid.style.display = 'none';
            elements.noResults.style.display = 'none';
            elements.errorMessage.style.display = 'none';

            try {
                // Simulate API call - Replace with actual fetch
                // const response = await fetch('/api/products');
                // const data = await response.json();
                
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                
                state.products = sampleProducts;
                state.isLoading = false;
                
                updateCategoryCounts();
                applyFilters();
                
            } catch (error) {
                console.error('Error fetching products:', error);
                state.isLoading = false;
                state.hasError = true;
                
                elements.skeletonLoader.style.display = 'none';
                elements.errorMessage.style.display = 'block';
            }
        }

        // ============================================
        // CATEGORY COUNTS
        // ============================================
        
        function updateCategoryCounts() {
            const counts = {
                all: state.products.length,
                pizza: state.products.filter(p => p.type === 'pizza').length,
                burger: state.products.filter(p => p.type === 'burger').length,
                drinks: state.products.filter(p => p.type === 'drinks').length,
                snacks: state.products.filter(p => p.type === 'snacks').length,
                desserts: state.products.filter(p => p.type === 'desserts').length
            };

            document.getElementById('countAll').textContent = counts.all;
            document.getElementById('countPizza').textContent = counts.pizza;
            document.getElementById('countBurger').textContent = counts.burger;
            document.getElementById('countDrinks').textContent = counts.drinks;
            document.getElementById('countSnacks').textContent = counts.snacks;
            document.getElementById('countDesserts').textContent = counts.desserts;
        }

        // ============================================
        // FILTERING & SORTING
        // ============================================
        
        function applyFilters() {
            let filtered = [...state.products];

            // Category filter
            if (state.currentCategory !== 'all') {
                filtered = filtered.filter(p => p.type === state.currentCategory);
            }

            // Search filter
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                filtered = filtered.filter(p => {
                    return p.name.toLowerCase().includes(query) ||
                           p.description.toLowerCase().includes(query) ||
                           p.keywords.some(k => k.toLowerCase().includes(query));
                });
            }

            // Sorting
            switch (state.sortBy) {
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'popularity':
                    filtered.sort((a, b) => b.popularity - a.popularity);
                    break;
                default:
                    // Default order (by id)
                    filtered.sort((a, b) => a.id - b.id);
            }

            state.filteredProducts = filtered;
            state.currentPage = 1;
            
            renderProducts();
            renderPagination();
            updateResultsCount();
        }

        function updateResultsCount() {
            elements.resultsCount.textContent = state.filteredProducts.length;
        }

        // ============================================
        // RENDER PRODUCTS
        // ============================================
        
        function renderProducts() {
            elements.skeletonLoader.style.display = 'none';
            
            if (state.filteredProducts.length === 0) {
                elements.productGrid.style.display = 'none';
                elements.noResults.style.display = 'block';
                elements.pagination.style.display = 'none';
                return;
            }

            elements.noResults.style.display = 'none';
            elements.productGrid.style.display = 'grid';
            elements.pagination.style.display = 'flex';

            // Pagination
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const paginatedProducts = state.filteredProducts.slice(startIndex, endIndex);

            let html = '';
            paginatedProducts.forEach(product => {
                html += `
                    <article class="product-card" data-product-id="${product.id}">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                            <span class="category-badge ${product.type}">${product.type}</span>
                            <button class="wishlist-btn" aria-label="Add to wishlist">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">
                                <a href="product-details.html?id=${product.id}">${product.name}</a>
                            </h3>
                            <p class="product-description">${product.description}</p>
                            <div class="product-meta">
                                <div class="product-rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span>${product.rating}</span>
                                    <span class="rating-count">(${product.reviews})</span>
                                </div>
                                <div class="product-time">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span>${product.prepTime}</span>
                                </div>
                            </div>
                            <div class="product-footer">
                                <div class="product-price">
                                    ${formatPrice(product.price)}
                                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                                </div>
                                <div class="product-actions">
                                    <button class="btn btn-primary" data-add-cart="${product.id}" aria-label="Add ${product.name} to cart">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                `;
            });

            elements.productGrid.innerHTML = html;

            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('[data-add-cart]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.currentTarget.dataset.addCart);
                    addToCart(productId);
                });
            });
        }

        // ============================================
        // RENDER PAGINATION
        // ============================================
        
        function renderPagination() {
            const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
            
            if (totalPages <= 1) {
                elements.pagination.innerHTML = '';
                return;
            }

            let html = '';

            // Previous button
            html += `
                <button class="pagination-btn" data-page="prev" ${state.currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            `;

            // Page numbers
            const maxVisiblePages = 5;
            let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                html += `<button class="pagination-btn" data-page="1">1</button>`;
                if (startPage > 2) {
                    html += `<span class="pagination-info">...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                html += `
                    <button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    html += `<span class="pagination-info">...</span>`;
                }
                html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
            }

            // Next button
            html += `
                <button class="pagination-btn" data-page="next" ${state.currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            `;

            elements.pagination.innerHTML = html;

            // Add event listeners
            document.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const page = e.currentTarget.dataset.page;
                    
                    if (page === 'prev') {
                        state.currentPage = Math.max(1, state.currentPage - 1);
                    } else if (page === 'next') {
                        state.currentPage = Math.min(totalPages, state.currentPage + 1);
                    } else {
                        state.currentPage = parseInt(page);
                    }
                    
                    renderProducts();
                    renderPagination();
                    
                    // Scroll to top of products
                    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }

        // ============================================
        // EVENT LISTENERS
        // ============================================
        
        function initEventListeners() {
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

            // Category filter
            elements.categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.categoryBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                    
                    state.currentCategory = btn.dataset.category;
                    applyFilters();
                });
            });

            // Search input (with debounce)
            const debouncedSearch = debounce((value) => {
                state.searchQuery = value;
                applyFilters();
            }, 250);

            elements.searchInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                elements.clearSearch.classList.toggle('show', value.length > 0);
                debouncedSearch(value);
            });

            // Sync header search inputs
            elements.headerSearch?.addEventListener('input', (e) => {
                elements.searchInput.value = e.target.value;
                elements.searchInput.dispatchEvent(new Event('input'));
            });

            elements.mobileSearch?.addEventListener('input', (e) => {
                elements.searchInput.value = e.target.value;
                elements.searchInput.dispatchEvent(new Event('input'));
            });

            // Clear search
            elements.clearSearch.addEventListener('click', () => {
                elements.searchInput.value = '';
                elements.headerSearch && (elements.headerSearch.value = '');
                elements.mobileSearch && (elements.mobileSearch.value = '');
                elements.clearSearch.classList.remove('show');
                state.searchQuery = '';
                applyFilters();
            });

            // Sort dropdown
            elements.sortBtn.addEventListener('click', () => {
                elements.sortDropdown.classList.toggle('active');
                elements.sortBtn.setAttribute('aria-expanded', 
                    elements.sortDropdown.classList.contains('active'));
            });

            elements.sortOptions.forEach(option => {
                option.addEventListener('click', () => {
                    elements.sortOptions.forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    
                    state.sortBy = option.dataset.sort;
                    elements.sortLabel.textContent = option.textContent.trim();
                    elements.sortDropdown.classList.remove('active');
                    
                    applyFilters();
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!elements.sortDropdown.contains(e.target)) {
                    elements.sortDropdown.classList.remove('active');
                }
            });

            // No results suggestions
            document.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    
                    if (action === 'clear-filters' || action === 'show-all') {
                        // Reset category
                        elements.categoryBtns.forEach(b => {
                            b.classList.remove('active');
                            b.setAttribute('aria-selected', 'false');
                        });
                        document.querySelector('[data-category="all"]').classList.add('active');
                        document.querySelector('[data-category="all"]').setAttribute('aria-selected', 'true');
                        
                        // Reset search
                        elements.searchInput.value = '';
                        elements.clearSearch.classList.remove('show');
                        
                        state.currentCategory = 'all';
                        state.searchQuery = '';
                        applyFilters();
                    }
                });
            });

            // Retry button
            elements.retryBtn.addEventListener('click', () => {
                fetchProducts();
            });

            // Cart button
            elements.cartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }

        // ============================================
        // INITIALIZE APP
        // ============================================
        
        function init() {
            loadCart();
            initEventListeners();
            fetchProducts();
        }

        // Start the app
        document.addEventListener('DOMContentLoaded', init);