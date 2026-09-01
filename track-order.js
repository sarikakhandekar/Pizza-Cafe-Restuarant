// track-order.js - Complete JavaScript for Order Tracking Page

// ============================================
// Configuration & Constants
// ============================================
const CONFIG = {
    loadingDuration: 2000,
    refreshCooldown: 5000,
    statusUpdateInterval: 30000,
    countdownUpdateInterval: 60000,
    markerAnimationDuration: 3000,
    toastDuration: 3000
};

const ORDER_STATUSES = {
    CONFIRMED: 1,
    PREPARING: 2,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4
};

// ============================================
// State Management
// ============================================
let appState = {
    orderData: null,
    currentStatus: ORDER_STATUSES.PREPARING,
    etaMinutes: 18,
    isRefreshing: false,
    itemsExpanded: false,
    countdownInterval: null,
    statusUpdateInterval: null,
    markerAnimationFrame: null
};

// ============================================
// Mock Order Data
// ============================================
const mockOrderData = {
    orderId: 'FE123456',
    restaurantName: 'Spice Kitchen',
    restaurantLogo: 'fas fa-utensils',
    orderDateTime: new Date(Date.now() - 35 * 60000), // 35 mins ago
    paymentMethod: 'Credit Card',
    paymentIcon: 'fas fa-credit-card',
    status: ORDER_STATUSES.PREPARING,
    eta: {
        min: 25,
        max: 35,
        remaining: 18
    },
    statusTimes: {
        1: new Date(Date.now() - 35 * 60000),
        2: new Date(Date.now() - 20 * 60000),
        3: null,
        4: null
    },
    deliveryPartner: {
        name: 'Ravi Kumar',
        rating: 4.8,
        deliveries: '1.2k',
        vehicle: 'KA-01-AB-1234',
        phone: '+91 98765 43210',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi'
    },
    items: [
        { name: 'Butter Chicken', quantity: 1, price: 320, customization: 'Medium Spicy' },
        { name: 'Garlic Naan', quantity: 2, price: 60, customization: null },
        { name: 'Jeera Rice', quantity: 1, price: 150, customization: 'Regular' },
        { name: 'Paneer Tikka', quantity: 1, price: 280, customization: 'Extra Cheese' },
        { name: 'Mango Lassi', quantity: 2, price: 90, customization: null }
    ],
    pricing: {
        itemTotal: 900,
        deliveryFee: 40,
        taxes: 45,
        discount: 0,
        grandTotal: 985
    },
    deliveryAddress: {
        type: 'Home',
        address: '42, Green Valley Apartments, Koramangala 4th Block, Bangalore - 560034',
        landmark: 'Near Sony Signal, Opposite Metro Station'
    }
};

// ============================================
// DOM Elements
// ============================================
const elements = {};

function cacheElements() {
    // Containers
    elements.skeletonLoader = document.getElementById('skeleton-loader');
    elements.mainContent = document.getElementById('main-content');
    
    // Header
    elements.backBtn = document.getElementById('backBtn');
    elements.refreshBtn = document.getElementById('refreshBtn');
    elements.orderId = document.getElementById('orderId');
    
    // Order Info
    elements.restaurantName = document.getElementById('restaurantName');
    elements.orderDateTime = document.getElementById('orderDateTime');
    elements.paymentMethod = document.getElementById('paymentMethod');
    elements.orderTotal = document.getElementById('orderTotal');
    
    // Timeline - Horizontal
    elements.timelineProgress = document.getElementById('timelineProgress');
    elements.timelineHorizontal = document.getElementById('timelineHorizontal');
    elements.stepTimes = {
        1: document.getElementById('step1Time'),
        2: document.getElementById('step2Time'),
        3: document.getElementById('step3Time'),
        4: document.getElementById('step4Time')
    };
    
    // Timeline - Vertical
    elements.timelineVertical = document.getElementById('timelineVertical');
    elements.vStepTimes = {
        1: document.getElementById('vStep1Time'),
        2: document.getElementById('vStep2Time'),
        3: document.getElementById('vStep3Time'),
        4: document.getElementById('vStep4Time')
    };
    
    // ETA
    elements.etaSection = document.getElementById('etaSection');
    elements.etaTime = document.getElementById('etaTime');
    elements.countdownProgress = document.getElementById('countdownProgress');
    elements.countdownText = document.getElementById('countdownText');
    
    // Map
    elements.mapSection = document.getElementById('mapSection');
    elements.deliveryMarker = document.getElementById('deliveryMarker');
    
    // Partner
    elements.partnerSection = document.getElementById('partnerSection');
    elements.partnerName = document.getElementById('partnerName');
    elements.partnerRating = document.getElementById('partnerRating');
    
    // Items
    elements.itemsToggle = document.getElementById('itemsToggle');
    elements.toggleItemsBtn = document.getElementById('toggleItemsBtn');
    elements.itemsContainer = document.getElementById('itemsContainer');
    elements.itemsList = document.getElementById('itemsList');
    elements.itemsCount = document.getElementById('itemsCount');
    elements.itemTotal = document.getElementById('itemTotal');
    elements.deliveryFee = document.getElementById('deliveryFee');
    elements.taxes = document.getElementById('taxes');
    elements.grandTotal = document.getElementById('grandTotal');
    
    // Address
    elements.addressType = document.getElementById('addressType');
    elements.deliveryAddress = document.getElementById('deliveryAddress');
    elements.addressLandmark = document.getElementById('addressLandmark');
    
    // Actions
    elements.helpBtn = document.getElementById('helpBtn');
    elements.cancelBtn = document.getElementById('cancelBtn');
    elements.homeBtn = document.getElementById('homeBtn');
    
    // Sticky Bar
    elements.stickyEtaBar = document.getElementById('stickyEtaBar');
    elements.stickyStatus = document.getElementById('stickyStatus');
    elements.stickyEta = document.getElementById('stickyEta');
    
    // Toast
    elements.toast = document.getElementById('toast');
    elements.toastMessage = document.getElementById('toastMessage');
    
    // Modals
    elements.cancelModal = document.getElementById('cancelModal');
    elements.cancelModalClose = document.getElementById('cancelModalClose');
    elements.confirmCancel = document.getElementById('confirmCancel');
    elements.helpModal = document.getElementById('helpModal');
    elements.helpModalClose = document.getElementById('helpModalClose');
}

// ============================================
// Utility Functions
// ============================================
function formatTime(date) {
    if (!date) return '--';
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function formatDate(date) {
    if (!date) return '--';
    const today = new Date();
    const orderDate = new Date(date);
    
    if (orderDate.toDateString() === today.toDateString()) {
        return `Today, ${formatTime(date)}`;
    }
    
    return orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

function getStatusText(status) {
    switch (status) {
        case ORDER_STATUSES.CONFIRMED:
            return 'Order Confirmed';
        case ORDER_STATUSES.PREPARING:
            return 'Preparing your order';
        case ORDER_STATUSES.OUT_FOR_DELIVERY:
            return 'Out for delivery';
        case ORDER_STATUSES.DELIVERED:
            return 'Order Delivered';
        default:
            return 'Processing';
    }
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

// ============================================
// Loading & Initialization
// ============================================
function showLoading() {
    elements.skeletonLoader.classList.remove('hidden');
    elements.mainContent.classList.add('hidden');
}

function hideLoading() {
    elements.skeletonLoader.classList.add('hidden');
    elements.mainContent.classList.remove('hidden');
    elements.mainContent.style.animation = 'fadeIn 0.5s ease';
}

function initializeApp() {
    cacheElements();
    showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
        loadOrderData();
        hideLoading();
        startAnimations();
        startCountdown();
        startStatusUpdates();
    }, CONFIG.loadingDuration);
    
    setupEventListeners();
    setupScrollListener();
}

// ============================================
// Data Loading & Rendering
// ============================================
function loadOrderData() {
    appState.orderData = { ...mockOrderData };
    appState.currentStatus = mockOrderData.status;
    appState.etaMinutes = mockOrderData.eta.remaining;
    
    renderOrderInfo();
    renderTimeline();
    renderETA();
    renderItems();
    renderAddress();
    renderPartner();
    updateStickyBar();
}

function renderOrderInfo() {
    const data = appState.orderData;
    
    elements.orderId.textContent = `Order ID: ${data.orderId}`;
    elements.restaurantName.textContent = data.restaurantName;
    elements.orderDateTime.querySelector('span').textContent = formatDate(data.orderDateTime);
    elements.paymentMethod.innerHTML = `<i class="${data.paymentIcon}"></i> ${data.paymentMethod}`;
    elements.orderTotal.textContent = formatCurrency(data.pricing.grandTotal);
}

function renderTimeline() {
    const currentStatus = appState.currentStatus;
    const statusTimes = appState.orderData.statusTimes;
    
    // Update horizontal timeline
    const progressPercentage = ((currentStatus - 1) / 3) * 100;
    elements.timelineProgress.style.width = `${progressPercentage}%`;
    
    // Update step times and states
    const horizontalSteps = elements.timelineHorizontal.querySelectorAll('.timeline-step');
    const verticalSteps = elements.timelineVertical.querySelectorAll('.v-timeline-step');
    
    horizontalSteps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('completed', 'active', 'pending');
        
        if (stepNum < currentStatus) {
            step.classList.add('completed');
        } else if (stepNum === currentStatus) {
            step.classList.add('active');
        } else {
            step.classList.add('pending');
        }
        
        // Update times
        if (elements.stepTimes[stepNum]) {
            elements.stepTimes[stepNum].textContent = formatTime(statusTimes[stepNum]);
        }
    });
    
    verticalSteps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('completed', 'active', 'pending');
        
        if (stepNum < currentStatus) {
            step.classList.add('completed');
        } else if (stepNum === currentStatus) {
            step.classList.add('active');
        } else {
            step.classList.add('pending');
        }
        
        // Update times
        if (elements.vStepTimes[stepNum]) {
            elements.vStepTimes[stepNum].textContent = formatTime(statusTimes[stepNum]);
        }
    });
}

function renderETA() {
    const eta = appState.orderData.eta;
    elements.etaTime.textContent = `${eta.min}-${eta.max} mins`;
    elements.countdownText.textContent = appState.etaMinutes;
    
    // Update countdown circle
    updateCountdownCircle();
    
    // Show/hide ETA section based on delivery status
    if (appState.currentStatus === ORDER_STATUSES.DELIVERED) {
        elements.etaSection.style.display = 'none';
    } else {
        elements.etaSection.style.display = 'block';
    }
}

function updateCountdownCircle() {
    const circumference = 2 * Math.PI * 45;
    const progress = appState.etaMinutes / appState.orderData.eta.max;
    const offset = circumference * (1 - progress);
    
    elements.countdownProgress.style.strokeDasharray = circumference;
    elements.countdownProgress.style.strokeDashoffset = offset;
}

function renderItems() {
    const items = appState.orderData.items;
    const pricing = appState.orderData.pricing;
    
    elements.itemsCount.textContent = `(${items.length} items)`;
    
    elements.itemsList.innerHTML = items.map(item => `
        <li class="item-row">
            <div class="item-info">
                <span class="item-qty">${item.quantity}x</span>
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    ${item.customization ? `<span class="item-custom">${item.customization}</span>` : ''}
                </div>
            </div>
            <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
        </li>
    `).join('');
    
    elements.itemTotal.textContent = formatCurrency(pricing.itemTotal);
    elements.deliveryFee.textContent = formatCurrency(pricing.deliveryFee);
    elements.taxes.textContent = formatCurrency(pricing.taxes);
    elements.grandTotal.textContent = formatCurrency(pricing.grandTotal);
}

function renderAddress() {
    const address = appState.orderData.deliveryAddress;
    
    elements.addressType.textContent = address.type;
    elements.deliveryAddress.textContent = address.address;
    elements.addressLandmark.querySelector('span').textContent = address.landmark;
}

function renderPartner() {
    const partner = appState.orderData.deliveryPartner;
    
    elements.partnerName.textContent = partner.name;
    elements.partnerRating.textContent = partner.rating;
    
    // Show partner section only when out for delivery
    if (appState.currentStatus >= ORDER_STATUSES.OUT_FOR_DELIVERY) {
        elements.partnerSection.classList.add('visible');
        elements.mapSection.classList.add('visible');
    } else {
        elements.partnerSection.classList.remove('visible');
        elements.mapSection.classList.remove('visible');
    }
}

function updateStickyBar() {
    elements.stickyStatus.textContent = getStatusText(appState.currentStatus);
    elements.stickyEta.textContent = `${appState.etaMinutes} mins`;
}

// ============================================
// Animations
// ============================================
function startAnimations() {
    animateDeliveryMarker();
    animatePulseEffects();
}

function animateDeliveryMarker() {
    if (appState.currentStatus !== ORDER_STATUSES.OUT_FOR_DELIVERY) return;
    
    let progress = 0;
    const animate = () => {
        progress += 0.002;
        if (progress > 1) progress = 0;
        
        // Calculate position along the route
        const x = 10 + (progress * 80);
        const y = 70 - Math.sin(progress * Math.PI) * 40;
        
        elements.deliveryMarker.style.left = `${x}%`;
        elements.deliveryMarker.style.top = `${y}%`;
        
        appState.markerAnimationFrame = requestAnimationFrame(animate);
    };
    
    animate();
}

function animatePulseEffects() {
    // Pulse effects are handled by CSS animations
}

// ============================================
// Countdown Timer
// ============================================
function startCountdown() {
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
    }
    
    appState.countdownInterval = setInterval(() => {
        if (appState.etaMinutes > 0 && appState.currentStatus !== ORDER_STATUSES.DELIVERED) {
            appState.etaMinutes--;
            elements.countdownText.textContent = appState.etaMinutes;
            elements.stickyEta.textContent = `${appState.etaMinutes} mins`;
            updateCountdownCircle();
            
            if (appState.etaMinutes <= 5) {
                showToast('Your order is arriving soon!', 'success');
            }
        }
    }, CONFIG.countdownUpdateInterval);
}

// ============================================
// Status Updates (Simulated)
// ============================================
function startStatusUpdates() {
    // Simulate status progression for demo
    setTimeout(() => {
        if (appState.currentStatus === ORDER_STATUSES.PREPARING) {
            updateOrderStatus(ORDER_STATUSES.OUT_FOR_DELIVERY);
        }
    }, 10000); // 10 seconds for demo
    
    setTimeout(() => {
        if (appState.currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) {
            updateOrderStatus(ORDER_STATUSES.DELIVERED);
        }
    }, 25000); // 25 seconds for demo
}

function updateOrderStatus(newStatus) {
    appState.currentStatus = newStatus;
    appState.orderData.status = newStatus;
    appState.orderData.statusTimes[newStatus] = new Date();
    
    renderTimeline();
    renderPartner();
    updateStickyBar();
    
    // Show notification
    const statusText = getStatusText(newStatus);
    showToast(`Status updated: ${statusText}`, 'info');
    
    // Handle delivery completion
    if (newStatus === ORDER_STATUSES.DELIVERED) {
        handleDeliveryComplete();
    }
    
    // Start marker animation when out for delivery
    if (newStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) {
        animateDeliveryMarker();
    }
}

function handleDeliveryComplete() {
    // Stop countdown
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
    }
    
    // Stop marker animation
    if (appState.markerAnimationFrame) {
        cancelAnimationFrame(appState.markerAnimationFrame);
    }
    
    // Hide ETA section
    elements.etaSection.style.display = 'none';
    
    // Update sticky bar
    elements.stickyEtaBar.classList.add('delivered');
    elements.stickyStatus.textContent = 'Order Delivered';
    elements.stickyEta.textContent = 'Enjoy!';
    
    // Hide cancel button
    elements.cancelBtn.style.display = 'none';
    
    // Show rating prompt after a delay
    setTimeout(() => {
        showToast('Enjoy your meal! Don\'t forget to rate your experience.', 'success');
    }, 2000);
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Back button
    elements.backBtn.addEventListener('click', handleBackClick);
    
    // Refresh button
    elements.refreshBtn.addEventListener('click', handleRefresh);
    
    // Items toggle
    elements.itemsToggle.addEventListener('click', toggleItems);
    elements.toggleItemsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleItems();
    });
    
    // Action buttons
    elements.helpBtn.addEventListener('click', openHelpModal);
    elements.cancelBtn.addEventListener('click', openCancelModal);
    elements.homeBtn.addEventListener('click', handleHomeClick);
    
    // Cancel modal
    elements.cancelModalClose.addEventListener('click', closeCancelModal);
    elements.confirmCancel.addEventListener('click', handleCancelOrder);
    elements.cancelModal.addEventListener('click', (e) => {
        if (e.target === elements.cancelModal) closeCancelModal();
    });
    
    // Help modal
    elements.helpModalClose.addEventListener('click', closeHelpModal);
    elements.helpModal.addEventListener('click', (e) => {
        if (e.target === elements.helpModal) closeHelpModal();
    });
    
    // Help options
    document.querySelectorAll('.help-option').forEach(option => {
        option.addEventListener('click', handleHelpOption);
    });
    
    // Partner actions
    document.querySelector('.call-btn')?.addEventListener('click', handleCallPartner);
    document.querySelector('.message-btn')?.addEventListener('click', handleMessagePartner);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

function setupScrollListener() {
    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScroll);
}

// ============================================
// Event Handlers
// ============================================
function handleBackClick() {
    // Animate back button
    elements.backBtn.classList.add('clicked');
    setTimeout(() => {
        elements.backBtn.classList.remove('clicked');
        // Navigate back (in real app)
        window.history.back();
    }, 200);
}

function handleRefresh() {
    if (appState.isRefreshing) return;
    
    appState.isRefreshing = true;
    elements.refreshBtn.classList.add('spinning');
    
    showToast('Refreshing order status...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        elements.refreshBtn.classList.remove('spinning');
        appState.isRefreshing = false;
        
        // Reload data
        renderTimeline();
        renderETA();
        updateStickyBar();
        
        showToast('Order status updated!', 'success');
    }, 1500);
}

function toggleItems() {
    appState.itemsExpanded = !appState.itemsExpanded;
    
    elements.itemsContainer.classList.toggle('collapsed', !appState.itemsExpanded);
    elements.toggleItemsBtn.classList.toggle('expanded', appState.itemsExpanded);
    
    const icon = elements.toggleItemsBtn.querySelector('i');
    icon.style.transform = appState.itemsExpanded ? 'rotate(180deg)' : 'rotate(0)';
    
    const text = elements.toggleItemsBtn.querySelector('span');
    text.textContent = appState.itemsExpanded ? 'Hide Details' : 'View Details';
}

function openHelpModal() {
    elements.helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
    elements.helpModal.classList.remove('active');
    document.body.style.overflow = '';
}

function openCancelModal() {
    if (appState.currentStatus === ORDER_STATUSES.DELIVERED) {
        showToast('Order has already been delivered', 'error');
        return;
    }
    
    if (appState.currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) {
        showToast('Cannot cancel order that is out for delivery', 'error');
        return;
    }
    
    elements.cancelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCancelModal() {
    elements.cancelModal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleCancelOrder() {
    closeCancelModal();
    
    showToast('Cancelling your order...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showToast('Order cancelled successfully. Refund will be processed within 3-5 business days.', 'success');
        
        // In real app, redirect to orders page
        setTimeout(() => {
            window.location.href = '/orders';
        }, 2000);
    }, 1500);
}

function handleHomeClick() {
    // Navigate to home
    window.location.href = '/';
}

function handleHelpOption(e) {
    const option = e.currentTarget.querySelector('span').textContent;
    closeHelpModal();
    showToast(`Connecting you with support for: ${option}`, 'info');
    
    // In real app, navigate to specific help page or open chat
}

function handleCallPartner() {
    const phone = appState.orderData.deliveryPartner.phone;
    showToast(`Calling ${phone}...`, 'info');
    
    // In real app:
    // window.location.href = `tel:${phone}`;
}

function handleMessagePartner() {
    showToast('Opening chat with delivery partner...', 'info');
    
    // In real app, open chat interface
}

function handleScroll() {
    const etaSection = elements.etaSection;
    const stickyBar = elements.stickyEtaBar;
    
    if (!etaSection) return;
    
    const etaRect = etaSection.getBoundingClientRect();
    const isEtaHidden = etaRect.bottom < 0;
    
    if (isEtaHidden && appState.currentStatus !== ORDER_STATUSES.DELIVERED) {
        stickyBar.classList.add('visible');
    } else {
        stickyBar.classList.remove('visible');
    }
}

function handleKeyPress(e) {
    // Close modals on Escape
    if (e.key === 'Escape') {
        if (elements.cancelModal.classList.contains('active')) {
            closeCancelModal();
        }
        if (elements.helpModal.classList.contains('active')) {
            closeHelpModal();
        }
    }
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'info') {
    const toast = elements.toast;
    const icon = toast.querySelector('i');
    
    // Set icon based on type
    const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    icon.className = icons[type] || icons.info;
    elements.toastMessage.textContent = message;
    
    // Reset animation
    toast.classList.remove('show', 'info', 'success', 'error', 'warning');
    toast.classList.add(type);
    
    // Force reflow
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

// ============================================
// Service Worker & Offline Support
// ============================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
}

// ============================================
// Push Notifications
// ============================================
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted');
        }
    }
}

function showPushNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '/icons/notification-icon.png',
            badge: '/icons/badge-icon.png'
        });
    }
}

// ============================================
// Visibility API - Handle Tab Visibility
// ============================================
function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is hidden
            if (appState.markerAnimationFrame) {
                cancelAnimationFrame(appState.markerAnimationFrame);
            }
        } else {
            // Resume animations when tab is visible
            if (appState.currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) {
                animateDeliveryMarker();
            }
            // Refresh data when returning to tab
            handleRefresh();
        }
    });
}

// ============================================
// Network Status
// ============================================
function setupNetworkListeners() {
    window.addEventListener('online', () => {
        showToast('You\'re back online!', 'success');
        handleRefresh();
    });
    
    window.addEventListener('offline', () => {
        showToast('You\'re offline. Some features may not work.', 'warning');
    });
}

// ============================================
// Cleanup
// ============================================
function cleanup() {
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
    }
    if (appState.statusUpdateInterval) {
        clearInterval(appState.statusUpdateInterval);
    }
    if (appState.markerAnimationFrame) {
        cancelAnimationFrame(appState.markerAnimationFrame);
    }
}

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupVisibilityHandler();
    setupNetworkListeners();
    // requestNotificationPermission(); // Uncomment if needed
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// ============================================
// Expose for debugging (development only)
// ============================================
if (process.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    window.trackOrderDebug = {
        state: appState,
        updateStatus: updateOrderStatus,
        showToast: showToast,
        ORDER_STATUSES
    };
}