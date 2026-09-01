/**
 * ============================================
 * MY ORDERS PAGE - JAVASCRIPT
 * Food Delivery App (Swiggy/Zomato Style)
 * ============================================
 * 
 * Resume-Ready Line:
 * "Implemented a My Orders page displaying order history, 
 * status tracking, and order details using JavaScript and localStorage."
 */

// ========== CONSTANTS & CONFIGURATION ==========
const STORAGE_KEY = 'MY_ORDERS';

const ORDER_STATUS = {
    PREPARING: 'Preparing',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

const STATUS_ICONS = {
    'Preparing': 'fa-fire-burner',
    'Out for Delivery': 'fa-motorcycle',
    'Delivered': 'fa-circle-check',
    'Cancelled': 'fa-circle-xmark'
};

// ========== DOM ELEMENTS ==========
const ordersList = document.getElementById('ordersList');
const emptyState = document.getElementById('emptyState');
const ordersStats = document.getElementById('ordersStats');
const orderFilter = document.getElementById('orderFilter');
const orderModal = document.getElementById('orderModal');
const closeModalBtn = document.getElementById('closeModal');
const toastContainer = document.getElementById('toastContainer');

// Stats elements
const totalOrdersCount = document.getElementById('totalOrdersCount');
const activeOrdersCount = document.getElementById('activeOrdersCount');
const deliveredOrdersCount = document.getElementById('deliveredOrdersCount');

// Modal elements
const modalOrderId = document.getElementById('modalOrderId');
const modalOrderDate = document.getElementById('modalOrderDate');
const modalOrderStatus = document.getElementById('modalOrderStatus');
const orderTimeline = document.getElementById('orderTimeline');
const modalItemsList = document.getElementById('modalItemsList');
const modalAddress = document.getElementById('modalAddress');
const modalSubtotal = document.getElementById('modalSubtotal');
const modalDeliveryFee = document.getElementById('modalDeliveryFee');
const modalTax = document.getElementById('modalTax');
const modalDiscount = document.getElementById('modalDiscount');
const modalGrandTotal = document.getElementById('modalGrandTotal');
const modalPaymentMethod = document.getElementById('modalPaymentMethod');
const discountRow = document.getElementById('discountRow');
const trackOrderBtn = document.getElementById('trackOrderBtn');
const reorderBtn = document.getElementById('reorderBtn');

// ========== STATE ==========
let allOrders = [];
let currentOrder = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

/**
 * Initialize the page with order data
 */
function initializePage() {
    loadOrders();
    renderOrders();
    updateStatistics();
    
    // Add sample orders if none exist (for demo purposes)
    if (allOrders.length === 0) {
        addSampleOrders();
        loadOrders();
        renderOrders();
        updateStatistics();
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Filter dropdown change
    orderFilter.addEventListener('change', handleFilterChange);
    
    // Modal close button
    closeModalBtn.addEventListener('click', closeModal);
    
    // Click outside modal to close
    orderModal.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && orderModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Track order button
    trackOrderBtn.addEventListener('click', handleTrackOrder);
    
    // Reorder button
    reorderBtn.addEventListener('click', handleReorder);
}

// ========== DATA FUNCTIONS ==========

/**
 * Load orders from localStorage
 */
function loadOrders() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        allOrders = stored ? JSON.parse(stored) : [];
        
        // Sort orders by date (newest first)
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error loading orders:', error);
        allOrders = [];
    }
}

/**
 * Save orders to localStorage
 */
function saveOrders() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

/**
 * Add sample orders for demonstration
 */
function addSampleOrders() {
    const sampleOrders = [
        {
            orderId: 'FE' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            items: [
                { name: 'Margherita Pizza', qty: 1, price: 299 },
                { name: 'Garlic Bread', qty: 2, price: 149 },
                { name: 'Coke 500ml', qty: 2, price: 60 }
            ],
            subtotal: 717,
            deliveryFee: 40,
            tax: 36,
            discount: 50,
            total: 743,
            paymentMethod: 'UPI',
            status: 'Preparing',
            address: '123 Main Street, Andheri West, Mumbai, Maharashtra 400058'
        },
        {
            orderId: 'FE' + (Date.now() - 86400000).toString().slice(-6),
            date: new Date(Date.now() - 86400000).toISOString(),
            items: [
                { name: 'Chicken Biryani', qty: 2, price: 320 },
                { name: 'Raita', qty: 1, price: 49 },
                { name: 'Gulab Jamun', qty: 4, price: 40 }
            ],
            subtotal: 849,
            deliveryFee: 30,
            tax: 42,
            discount: 0,
            total: 921,
            paymentMethod: 'Card',
            status: 'Delivered',
            address: '456 Park Avenue, Bandra East, Mumbai, Maharashtra 400051'
        },
        {
            orderId: 'FE' + (Date.now() - 172800000).toString().slice(-6),
            date: new Date(Date.now() - 172800000).toISOString(),
            items: [
                { name: 'Double Cheese Burger', qty: 2, price: 189 },
                { name: 'French Fries Large', qty: 1, price: 129 },
                { name: 'Chocolate Shake', qty: 2, price: 149 }
            ],
            subtotal: 805,
            deliveryFee: 25,
            tax: 40,
            discount: 100,
            total: 770,
            paymentMethod: 'COD',
            status: 'Out for Delivery',
            address: '789 Lake View Road, Powai, Mumbai, Maharashtra 400076'
        },
        {
            orderId: 'FE' + (Date.now() - 604800000).toString().slice(-6),
            date: new Date(Date.now() - 604800000).toISOString(),
            items: [
                { name: 'Paneer Butter Masala', qty: 1, price: 259 },
                { name: 'Butter Naan', qty: 4, price: 45 },
                { name: 'Dal Makhani', qty: 1, price: 199 }
            ],
            subtotal: 638,
            deliveryFee: 35,
            tax: 32,
            discount: 0,
            total: 705,
            paymentMethod: 'UPI',
            status: 'Cancelled',
            address: '321 Hill Road, Bandra West, Mumbai, Maharashtra 400050'
        }
    ];
    
    allOrders = sampleOrders;
    saveOrders();
}

// ========== RENDER FUNCTIONS ==========

/**
 * Render all orders based on current filter
 */
function renderOrders() {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '';
        ordersStats.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    ordersStats.style.display = 'flex';
    emptyState.style.display = 'none';
    
    ordersList.innerHTML = filteredOrders.map((order, index) => 
        createOrderCard(order, index)
    ).join('');
    
    // Add event listeners to action buttons
    attachCardEventListeners();
}

/**
 * Get filtered orders based on selected filter
 */
function getFilteredOrders() {
    const filter = orderFilter.value;
    
    switch (filter) {
        case 'active':
            return allOrders.filter(order => 
                order.status === 'Preparing' || order.status === 'Out for Delivery'
            );
        case 'past':
            return allOrders.filter(order => 
                order.status === 'Delivered' || order.status === 'Cancelled'
            );
        default:
            return allOrders;
    }
}

/**
 * Create HTML for an order card
 */
function createOrderCard(order, index) {
    const formattedDate = formatDate(order.date);
    const statusClass = getStatusClass(order.status);
    const statusIcon = STATUS_ICONS[order.status] || 'fa-circle';
    const itemsPreview = getItemsPreview(order.items);
    
    return `
        <div class="order-card" data-order-id="${order.orderId}" style="animation-delay: ${index * 0.1}s">
            <!-- Order Card Header -->
            <div class="order-card-header">
                <div class="order-info">
                    <span class="order-id">#${order.orderId}</span>
                    <span class="order-date">
                        <i class="far fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                </div>
                <span class="status-badge ${statusClass}">
                    <i class="fas ${statusIcon}"></i>
                    ${order.status}
                </span>
            </div>
            
            <!-- Order Card Body -->
            <div class="order-card-body">
                <div class="items-preview">
                    ${itemsPreview}
                </div>
                
                <div class="price-section">
                    <div class="total-price">
                        <span class="total-amount">₹${order.total}</span>
                        <span class="payment-method">
                            <i class="fas fa-wallet"></i>
                            ${order.paymentMethod}
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Order Card Footer -->
            <div class="order-card-footer">
                <button class="action-btn primary view-details-btn" data-order-id="${order.orderId}">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="action-btn secondary track-order-btn" data-order-id="${order.orderId}" 
                    ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-location-crosshairs"></i>
                    Track
                </button>
                <button class="action-btn outline reorder-btn" data-order-id="${order.orderId}">
                    <i class="fas fa-rotate-right"></i>
                    Reorder
                </button>
            </div>
        </div>
    `;
}

/**
 * Get items preview HTML
 */
function getItemsPreview(items) {
    const displayItems = items.slice(0, 3);
    const remainingCount = items.length - 3;
    
    let html = displayItems.map(item => `
        <div class="item-row">
            <span class="item-qty">${item.qty}×</span>
            <span class="item-name">${item.name}</span>
        </div>
    `).join('');
    
    if (remainingCount > 0) {
        html += `<span class="more-items">+${remainingCount} more item${remainingCount > 1 ? 's' : ''}</span>`;
    }
    
    return html;
}

/**
 * Attach event listeners to card buttons
 */
function attachCardEventListeners() {
    // View Details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            openOrderDetails(orderId);
        });
    });
    
    // Track Order buttons
    document.querySelectorAll('.track-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const orderId = this.dataset.orderId;
                showToast('info', `Tracking order #${orderId}...`);
            }
        });
    });
    
    // Reorder buttons
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            handleReorderFromCard(orderId);
        });
    });
}

/**
 * Update statistics display
 */
function updateStatistics() {
    const total = allOrders.length;
    const active = allOrders.filter(o => 
        o.status === 'Preparing' || o.status === 'Out for Delivery'
    ).length;
    const delivered = allOrders.filter(o => o.status === 'Delivered').length;
    
    // Animate numbers
    animateNumber(totalOrdersCount, total);
    animateNumber(activeOrdersCount, active);
    animateNumber(deliveredOrdersCount, delivered);
}

/**
 * Animate number counting
 */
function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 20);
    const duration = 500;
    const stepTime = duration / (target / increment);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = current;
        }
    }, stepTime);
}

// ========== MODAL FUNCTIONS ==========

/**
 * Open order details modal
 */
function openOrderDetails(orderId) {
    currentOrder = allOrders.find(o => o.orderId === orderId);
    
    if (!currentOrder) {
        showToast('error', 'Order not found');
        return;
    }
    
    // Populate modal with order data
    populateModal(currentOrder);
    
    // Show modal
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close order details modal
 */
function closeModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
    currentOrder = null;
}

/**
 * Populate modal with order data
 */
function populateModal(order) {
    // Order info
    modalOrderId.textContent = `#${order.orderId}`;
    modalOrderDate.textContent = formatDate(order.date, true);
    
    // Status badge
    modalOrderStatus.textContent = order.status;
    modalOrderStatus.className = `status-badge ${getStatusClass(order.status)}`;
    
    // Update timeline
    updateTimeline(order.status);
    
    // Items list
    modalItemsList.innerHTML = order.items.map(item => `
        <div class="modal-item-row">
            <div class="modal-item-info">
                <span class="modal-item-qty">${item.qty}×</span>
                <span class="modal-item-name">${item.name}</span>
            </div>
            <span class="modal-item-price">₹${item.price * item.qty}</span>
        </div>
    `).join('');
    
    // Address
    modalAddress.textContent = order.address || 'Address not available';
    
    // Bill details
    modalSubtotal.textContent = `₹${order.subtotal || calculateSubtotal(order.items)}`;
    modalDeliveryFee.textContent = `₹${order.deliveryFee || 40}`;
    modalTax.textContent = `₹${order.tax || 0}`;
    
    // Discount
    if (order.discount && order.discount > 0) {
        modalDiscount.textContent = `-₹${order.discount}`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    modalGrandTotal.textContent = `₹${order.total}`;
    modalPaymentMethod.textContent = order.paymentMethod;
    
    // Update button states
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
        trackOrderBtn.disabled = true;
        trackOrderBtn.style.opacity = '0.5';
        trackOrderBtn.style.cursor = 'not-allowed';
    } else {
        trackOrderBtn.disabled = false;
        trackOrderBtn.style.opacity = '1';
        trackOrderBtn.style.cursor = 'pointer';
    }
}

/**
 * Update timeline based on order status
 */
function updateTimeline(status) {
    const steps = orderTimeline.querySelectorAll('.timeline-step');
    const statusOrder = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    
    let activeStepIndex;
    switch (status) {
        case 'Preparing':
            activeStepIndex = 2;
            break;
        case 'Out for Delivery':
            activeStepIndex = 3;
            break;
        case 'Delivered':
            activeStepIndex = 4;
            break;
        case 'Cancelled':
            activeStepIndex = -1; // All grey for cancelled
            break;
        default:
            activeStepIndex = 0;
    }
    
    steps.forEach((step, index) => {
        step.classList.remove('completed', 'active');
        
        if (status === 'Cancelled') {
            // Show cancelled state
            if (index === 0) {
                step.classList.add('completed');
            }
        } else if (index < activeStepIndex) {
            step.classList.add('completed');
        } else if (index === activeStepIndex) {
            step.classList.add('active');
        }
    });
}

/**
 * Calculate subtotal from items
 */
function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ========== EVENT HANDLERS ==========

/**
 * Handle filter change
 */
function handleFilterChange() {
    renderOrders();
}

/**
 * Handle track order button in modal
 */
function handleTrackOrder() {
    if (currentOrder && currentOrder.status !== 'Delivered' && currentOrder.status !== 'Cancelled') {
        showToast('info', `Opening live tracking for order #${currentOrder.orderId}...`);
        // In a real app, this would open a map/tracking view
    }
}

/**
 * Handle reorder button in modal
 */
function handleReorder() {
    if (currentOrder) {
        handleReorderFromCard(currentOrder.orderId);
        closeModal();
    }
}

/**
 * Handle reorder from card button
 */
function handleReorderFromCard(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    
    if (order) {
        // In a real app, this would add items to cart
        // For demo, we'll save to a "reorder" storage and show toast
        localStorage.setItem('REORDER_ITEMS', JSON.stringify(order.items));
        showToast('success', 'Items added to cart! Redirecting...');
        
        // Simulate redirect after delay
        setTimeout(() => {
            // window.location.href = 'cart.html';
            showToast('info', 'Would redirect to cart page');
        }, 1500);
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format date for display
 */
function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-IN', options);
}

/**
 * Get CSS class for status badge
 */
function getStatusClass(status) {
    switch (status) {
        case 'Preparing':
            return 'preparing';
        case 'Out for Delivery':
            return 'out-for-delivery';
        case 'Delivered':
            return 'delivered';
        case 'Cancelled':
            return 'cancelled';
        default:
            return '';
    }
}

/**
 * Show toast notification
 */
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                      type === 'error' ? 'fa-exclamation-circle' : 
                      'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${iconClass} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ========== INTEGRATION HELPER ==========

/**
 * Function to add a new order (call this from Order Confirmation page)
 * 
 * Usage in Order Confirmation page:
 * 
 * const newOrder = {
 *     orderId: "FE" + Date.now(),
 *     date: new Date().toISOString(),
 *     items: cartItems,
 *     subtotal: 500,
 *     deliveryFee: 40,
 *     tax: 25,
 *     discount: 50,
 *     total: 515,
 *     paymentMethod: "UPI",
 *     status: "Preparing",
 *     address: "123 Main Street, Mumbai"
 * };
 * 
 * let orders = JSON.parse(localStorage.getItem("MY_ORDERS")) || [];
 * orders.push(newOrder);
 * localStorage.setItem("MY_ORDERS", JSON.stringify(orders));
 */

// ========== DEBUG FUNCTIONS (Remove in production) ==========

/**
 * Clear all orders (for testing)
 */
function clearAllOrders() {
    localStorage.removeItem(STORAGE_KEY);
    allOrders = [];
    renderOrders();
    updateStatistics();
    showToast('info', 'All orders cleared');
}

/**
 * Add a test order (for testing)
 */
function addTestOrder() {
    const testOrder = {
        orderId: 'FE' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        items: [
            { name: 'Test Pizza', qty: 2, price: 299 },
            { name: 'Test Burger', qty: 1, price: 149 }
        ],
        subtotal: 747,
        deliveryFee: 40,
        tax: 37,
        discount: 0,
        total: 824,
        paymentMethod: 'UPI',
        status: 'Preparing',
        address: 'Test Address, Mumbai, India'
    };
    
    allOrders.unshift(testOrder);
    saveOrders();
    renderOrders();
    updateStatistics();
    showToast('success', 'Test order added');
}

// Expose debug functions to console
window.clearAllOrders = clearAllOrders;
window.addTestOrder = addTestOrder;

console.log('🍔 My Orders page loaded successfully!');
console.log('📝 Debug commands: clearAllOrders(), addTestOrder()');