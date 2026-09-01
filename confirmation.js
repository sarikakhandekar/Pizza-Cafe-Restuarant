/**
 * ============================================
 * ORDER CONFIRMATION PAGE - COMPLETE JAVASCRIPT
 * FoodExpress - Order Success Functionality
 * ============================================
 */

// ============================================
// STATE & CONFIGURATION
// ============================================

const CONFIG = {
    ESTIMATED_PREP_TIME: { min: 15, max: 20 },
    ESTIMATED_DELIVERY_TIME: { min: 25, max: 40 },
    REFERRAL_CODE_PREFIX: 'FOODIE',
    ANIMATION_DELAYS: {
        confetti: 1000,
        tracking: 3000
    }
};

let orderData = {
    orderId: '',
    orderDateTime: '',
    estimatedTime: '',
    paymentMethod: '',
    paymentStatus: '',
    customer: {},
    address: {},
    restaurant: {},
    items: [],
    billing: {},
    coupon: null,
    tip: 0,
    instructions: '',
    rating: 0,
    feedback: '',
    feedbackTags: []
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    // Order Info
    orderId: document.getElementById('orderId'),
    orderDateTime: document.getElementById('orderDateTime'),
    estimatedTime: document.getElementById('estimatedTime'),
    paymentMethod: document.getElementById('paymentMethod'),
    paymentStatus: document.getElementById('paymentStatus'),
    
    // Customer & Address
    customerName: document.getElementById('customerName'),
    customerPhone: document.getElementById('customerPhone'),
    fullAddress: document.getElementById('fullAddress'),
    landmark: document.getElementById('landmark'),
    addressTypeBadge: document.getElementById('addressTypeBadge'),
    
    // Restaurant
    restaurantName: document.getElementById('restaurantName'),
    restaurantAddress: document.getElementById('restaurantAddress'),
    restaurantImage: document.getElementById('restaurantImage'),
    
    // Items
    itemsList: document.getElementById('itemsList'),
    itemsCount: document.getElementById('itemsCount'),
    specialInstructions: document.getElementById('specialInstructions'),
    instructionText: document.getElementById('instructionText'),
    
    // Billing
    itemTotal: document.getElementById('itemTotal'),
    discountRow: document.getElementById('discountRow'),
    discountValue: document.getElementById('discountValue'),
    couponCodeDisplay: document.getElementById('couponCodeDisplay'),
    deliveryFee: document.getElementById('deliveryFee'),
    deliveryDiscountRow: document.getElementById('deliveryDiscountRow'),
    deliveryDiscountValue: document.getElementById('deliveryDiscountValue'),
    platformFee: document.getElementById('platformFee'),
    taxAmount: document.getElementById('taxAmount'),
    tipRow: document.getElementById('tipRow'),
    tipValue: document.getElementById('tipValue'),
    grandTotal: document.getElementById('grandTotal'),
    savingsBanner: document.getElementById('savingsBanner'),
    totalSavings: document.getElementById('totalSavings'),
    
    // Tracking
    confirmTime: document.getElementById('confirmTime'),
    deliveryPartner: document.getElementById('deliveryPartner'),
    
    // Buttons
    copyOrderId: document.getElementById('copyOrderId'),
    trackOrderBtn: document.getElementById('trackOrderBtn'),
    viewOrdersBtn: document.getElementById('viewOrdersBtn'),
    backToHomeBtn: document.getElementById('backToHomeBtn'),
    shareWhatsApp: document.getElementById('shareWhatsApp'),
    downloadInvoice: document.getElementById('downloadInvoice'),
    referBtn: document.getElementById('referBtn'),
    copyReferralCode: document.getElementById('copyReferralCode'),
    
    // Feedback
    starRating: document.getElementById('starRating'),
    ratingText: document.getElementById('ratingText'),
    feedbackForm: document.getElementById('feedbackForm'),
    feedbackText: document.getElementById('feedbackText'),
    submitFeedback: document.getElementById('submitFeedback'),
    feedbackThankyou: document.getElementById('feedbackThankyou'),
    
    // Other
    referralCode: document.getElementById('referralCode'),
    toastContainer: document.getElementById('toastContainer'),
    confettiCanvas: document.getElementById('confettiCanvas')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeConfirmationPage();
});

function initializeConfirmationPage() {
    // Load order data from localStorage
    loadOrderData();
    
    // Render all sections
    renderOrderInfo();
    renderCustomerInfo();
    renderRestaurantInfo();
    renderOrderItems();
    renderBillingDetails();
    
    // Setup event listeners
    setupEventListeners();
    
    // Trigger animations
    triggerConfettiAnimation();
    updateTrackingStatus();
    
    // Generate referral code
    generateReferralCode();
    
    // Clear cart data after successful order
    clearCartData();
}

// ============================================
// LOAD ORDER DATA
// ============================================

function loadOrderData() {
    // Try to load from localStorage (set by checkout page)
    const savedOrder = localStorage.getItem('foodExpressCurrentOrder');
    
    if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        orderData = { ...orderData, ...parsed };
        
        // If no order ID, generate one
        if (!orderData.orderId) {
            orderData.orderId = generateOrderId();
        }
    } else {
        // Generate sample data for demonstration
        generateSampleOrderData();
    }
    
    // Set order date/time if not set
    if (!orderData.orderDateTime) {
        orderData.orderDateTime = new Date().toISOString();
    }
    
    // Calculate estimated delivery time
    calculateEstimatedTime();
}

function generateSampleOrderData() {
    orderData = {
        orderId: generateOrderId(),
        orderDateTime: new Date().toISOString(),
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        customer: {
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com'
        },
        address: {
            type: 'home',
            houseNo: 'Flat 101, Tower B',
            street: 'Green Valley Apartments',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201301',
            landmark: 'Near City Mall'
        },
        restaurant: {
            name: 'Pizza Palace',
            address: 'Sector 18, Noida',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop'
        },
        items: [
            {
                id: 1,
                name: 'Margherita Pizza',
                price: 299,
                quantity: 2,
                isVeg: true,
                customization: 'Extra cheese, Thin crust'
            },
            {
                id: 2,
                name: 'Chicken Tikka',
                price: 349,
                quantity: 1,
                isVeg: false,
                customization: null
            },
            {
                id: 3,
                name: 'Garlic Bread',
                price: 149,
                quantity: 1,
                isVeg: true,
                customization: 'With cheese dip'
            },
            {
                id: 4,
                name: 'Coca Cola',
                price: 60,
                quantity: 2,
                isVeg: true,
                customization: null
            }
        ],
        billing: {
            itemTotal: 1216,
            discount: 100,
            deliveryFee: 40,
            deliveryDiscount: 0,
            platformFee: 5,
            tax: 55.80,
            grandTotal: 1246.80
        },
        coupon: 'WELCOME50',
        tip: 30,
        instructions: 'Please deliver at the gate. Call before arriving.'
    };
}

// ============================================
// GENERATE ORDER ID
// ============================================

function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const prefix = 'FE';
    return `#${prefix}${timestamp}${random}`;
}

// ============================================
// CALCULATE ESTIMATED TIME
// ============================================

function calculateEstimatedTime() {
    const now = new Date();
    const minTime = CONFIG.ESTIMATED_DELIVERY_TIME.min;
    const maxTime = CONFIG.ESTIMATED_DELIVERY_TIME.max;
    
    orderData.estimatedTime = `${minTime}-${maxTime} mins`;
}

// ============================================
// RENDER ORDER INFO
// ============================================

function renderOrderInfo() {
    // Order ID
    if (elements.orderId) {
        elements.orderId.textContent = orderData.orderId;
    }
    
    // Order Date & Time
    if (elements.orderDateTime) {
        const date = new Date(orderData.orderDateTime);
        const formattedDate = formatDateTime(date);
        elements.orderDateTime.textContent = formattedDate;
    }
    
    // Estimated Time
    if (elements.estimatedTime) {
        elements.estimatedTime.textContent = orderData.estimatedTime;
    }
    
    // Payment Method
    if (elements.paymentMethod) {
        elements.paymentMethod.innerHTML = getPaymentMethodBadge(orderData.paymentMethod);
    }
    
    // Payment Status
    if (elements.paymentStatus) {
        elements.paymentStatus.innerHTML = getPaymentStatusBadge(orderData.paymentMethod);
    }
    
    // Confirm Time
    if (elements.confirmTime) {
        elements.confirmTime.textContent = formatTime(new Date());
    }
}

function formatDateTime(date) {
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleDateString('en-IN', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getPaymentMethodBadge(method) {
    const methods = {
        'cod': {
            class: 'cod',
            icon: 'fa-money-bill-wave',
            text: 'Cash on Delivery'
        },
        'upi': {
            class: 'upi',
            icon: 'fa-mobile-alt',
            text: 'UPI Payment'
        },
        'card': {
            class: 'card',
            icon: 'fa-credit-card',
            text: 'Card Payment'
        },
        'wallet': {
            class: 'wallet',
            icon: 'fa-wallet',
            text: 'Wallet Payment'
        }
    };
    
    const m = methods[method] || methods['cod'];
    return `
        <span class="payment-badge ${m.class}">
            <i class="fas ${m.icon}"></i>
            ${m.text}
        </span>
    `;
}

function getPaymentStatusBadge(method) {
    if (method === 'cod') {
        return `
            <span class="status-badge pending">
                <i class="fas fa-clock"></i>
                Pay on Delivery
            </span>
        `;
    }
    return `
        <span class="status-badge paid">
            <i class="fas fa-check-circle"></i>
            Paid
        </span>
    `;
}

// ============================================
// RENDER CUSTOMER INFO
// ============================================

function renderCustomerInfo() {
    const { customer, address } = orderData;
    
    // Customer Name
    if (elements.customerName && customer.name) {
        elements.customerName.innerHTML = `
            <i class="fas fa-user"></i>
            ${customer.name}
        `;
    }
    
    // Customer Phone
    if (elements.customerPhone && customer.phone) {
        elements.customerPhone.innerHTML = `
            <i class="fas fa-phone-alt"></i>
            +91 ${formatPhoneNumber(customer.phone)}
        `;
    }
    
    // Full Address
    if (elements.fullAddress && address) {
        const fullAddr = buildFullAddress(address);
        elements.fullAddress.innerHTML = `
            <i class="fas fa-location-dot"></i>
            <p>${fullAddr}</p>
        `;
    }
    
    // Landmark
    if (elements.landmark && address.landmark) {
        elements.landmark.innerHTML = `
            <i class="fas fa-landmark"></i>
            ${address.landmark}
        `;
        elements.landmark.style.display = 'flex';
    } else if (elements.landmark) {
        elements.landmark.style.display = 'none';
    }
    
    // Address Type Badge
    if (elements.addressTypeBadge && address.type) {
        const icons = {
            'home': 'fa-home',
            'office': 'fa-building',
            'other': 'fa-map-pin'
        };
        elements.addressTypeBadge.innerHTML = `
            <i class="fas ${icons[address.type] || icons['other']}"></i>
            ${address.type.charAt(0).toUpperCase() + address.type.slice(1)}
        `;
    }
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

function buildFullAddress(address) {
    const parts = [];
    
    if (address.houseNo) parts.push(address.houseNo);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(`- ${address.pincode}`);
    
    return parts.join(', ');
}

// ============================================
// RENDER RESTAURANT INFO
// ============================================

function renderRestaurantInfo() {
    const { restaurant } = orderData;
    
    if (elements.restaurantName && restaurant.name) {
        elements.restaurantName.textContent = restaurant.name;
    }
    
    if (elements.restaurantAddress && restaurant.address) {
        elements.restaurantAddress.textContent = restaurant.address;
    }
    
    if (elements.restaurantImage && restaurant.image) {
        elements.restaurantImage.src = restaurant.image;
        elements.restaurantImage.alt = restaurant.name;
    }
}

// ============================================
// RENDER ORDER ITEMS
// ============================================

function renderOrderItems() {
    const { items, instructions } = orderData;
    
    // Items Count
    if (elements.itemsCount) {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        elements.itemsCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
    }
    
    // Items List
    if (elements.itemsList && items.length > 0) {
        elements.itemsList.innerHTML = items.map(item => `
            <div class="order-item">
                <div class="item-type-indicator ${item.isVeg ? 'veg' : 'non-veg'}"></div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    ${item.customization ? `<div class="item-customization">${item.customization}</div>` : ''}
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    // Special Instructions
    if (elements.specialInstructions && elements.instructionText && instructions) {
        elements.instructionText.textContent = instructions;
        elements.specialInstructions.style.display = 'block';
    }
}

// ============================================
// RENDER BILLING DETAILS
// ============================================

function renderBillingDetails() {
    const { billing, coupon, tip } = orderData;
    
    // Item Total
    if (elements.itemTotal) {
        elements.itemTotal.textContent = `₹${billing.itemTotal.toFixed(2)}`;
    }
    
    // Discount
    if (elements.discountRow && billing.discount > 0) {
        elements.discountRow.style.display = 'flex';
        if (elements.discountValue) {
            elements.discountValue.textContent = `-₹${billing.discount.toFixed(2)}`;
        }
        if (elements.couponCodeDisplay && coupon) {
            elements.couponCodeDisplay.textContent = coupon;
        }
    }
    
    // Delivery Fee
    if (elements.deliveryFee) {
        if (billing.deliveryFee === 0) {
            elements.deliveryFee.innerHTML = '<span class="text-success">FREE</span>';
        } else {
            elements.deliveryFee.textContent = `₹${billing.deliveryFee.toFixed(2)}`;
        }
    }
    
    // Delivery Discount
    if (elements.deliveryDiscountRow && billing.deliveryDiscount > 0) {
        elements.deliveryDiscountRow.style.display = 'flex';
        if (elements.deliveryDiscountValue) {
            elements.deliveryDiscountValue.textContent = `-₹${billing.deliveryDiscount.toFixed(2)}`;
        }
    }
    
    // Platform Fee
    if (elements.platformFee) {
        elements.platformFee.textContent = `₹${billing.platformFee.toFixed(2)}`;
    }
    
    // Tax
    if (elements.taxAmount) {
        elements.taxAmount.textContent = `₹${billing.tax.toFixed(2)}`;
    }
    
    // Tip
    if (elements.tipRow && tip > 0) {
        elements.tipRow.style.display = 'flex';
        if (elements.tipValue) {
            elements.tipValue.textContent = `₹${tip.toFixed(2)}`;
        }
    }
    
    // Grand Total
    if (elements.grandTotal) {
        const total = billing.grandTotal + (tip || 0);
        elements.grandTotal.textContent = `₹${total.toFixed(2)}`;
    }
    
    // Savings Banner
    const totalSavings = billing.discount + billing.deliveryDiscount;
    if (elements.savingsBanner && totalSavings > 0) {
        elements.savingsBanner.style.display = 'flex';
        if (elements.totalSavings) {
            elements.totalSavings.textContent = `₹${totalSavings.toFixed(2)}`;
        }
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Copy Order ID
    if (elements.copyOrderId) {
        elements.copyOrderId.addEventListener('click', () => {
            copyToClipboard(orderData.orderId, elements.copyOrderId, 'Order ID copied!');
        });
    }
    
    // Copy Referral Code
    if (elements.copyReferralCode) {
        elements.copyReferralCode.addEventListener('click', () => {
            const code = elements.referralCode?.textContent || '';
            copyToClipboard(code, elements.copyReferralCode, 'Referral code copied!');
        });
    }
    
    // Track Order Button
    if (elements.trackOrderBtn) {
        elements.trackOrderBtn.addEventListener('click', handleTrackOrder);
    }
    
    // View Orders Button
    if (elements.viewOrdersBtn) {
        elements.viewOrdersBtn.addEventListener('click', () => {
            window.location.href = 'orders.html';
        });
    }
    
    // Back to Home Button
    if (elements.backToHomeBtn) {
        elements.backToHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Share on WhatsApp
    if (elements.shareWhatsApp) {
        elements.shareWhatsApp.addEventListener('click', handleShareWhatsApp);
    }
    
    // Download Invoice
    if (elements.downloadInvoice) {
        elements.downloadInvoice.addEventListener('click', handleDownloadInvoice);
    }
    
    // Refer Button
    if (elements.referBtn) {
        elements.referBtn.addEventListener('click', handleReferShare);
    }
    
    // Star Rating
    if (elements.starRating) {
        setupStarRating();
    }
    
    // Feedback Tags
    document.querySelectorAll('.feedback-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => handleTagClick(tag));
    });
    
    // Submit Feedback
    if (elements.submitFeedback) {
        elements.submitFeedback.addEventListener('click', handleSubmitFeedback);
    }
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

async function copyToClipboard(text, button, successMessage) {
    try {
        await navigator.clipboard.writeText(text.replace('#', ''));
        
        // Visual feedback
        button.classList.add('copied');
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        showToast('success', 'Copied!', successMessage);
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    } catch (err) {
        showToast('error', 'Failed to copy', 'Please try again');
    }
}

// ============================================
// TRACK ORDER
// ============================================

function handleTrackOrder() {
    // Scroll to tracking section
    const trackingCard = document.querySelector('.tracking-card');
    if (trackingCard) {
        trackingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight effect
        trackingCard.style.boxShadow = '0 0 0 4px rgba(255, 107, 53, 0.3)';
        setTimeout(() => {
            trackingCard.style.boxShadow = '';
        }, 2000);
    }
    
    showToast('info', 'Live Tracking', 'Your order is being prepared');
}

// ============================================
// UPDATE TRACKING STATUS
// ============================================

function updateTrackingStatus() {
    // Simulate tracking progress
    setTimeout(() => {
        // This would be updated with real-time data from backend
        // For now, just showing the initial state
    }, CONFIG.ANIMATION_DELAYS.tracking);
}

// ============================================
// SHARE ON WHATSAPP
// ============================================

function handleShareWhatsApp() {
    const message = createShareMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    showToast('success', 'Opening WhatsApp', 'Share your order details');
}

function createShareMessage() {
    const { orderId, restaurant, billing, estimatedTime } = orderData;
    
    return `🍽️ *FoodExpress Order Confirmation*

✅ Order ID: ${orderId}
🏪 Restaurant: ${restaurant.name}
💰 Total: ₹${billing.grandTotal.toFixed(2)}
⏱️ Estimated Delivery: ${estimatedTime}

Track your order on FoodExpress!`;
}

// ============================================
// DOWNLOAD INVOICE
// ============================================

function handleDownloadInvoice() {
    // Create invoice data
    const invoiceContent = generateInvoiceContent();
    
    // For demo, show a toast
    showToast('info', 'Generating Invoice', 'Your invoice will be downloaded shortly');
    
    // Simulate download delay
    setTimeout(() => {
        // In real implementation, generate PDF using libraries like jsPDF
        downloadTextAsFile(invoiceContent, `FoodExpress_Invoice_${orderData.orderId.replace('#', '')}.txt`);
        showToast('success', 'Invoice Downloaded', 'Check your downloads folder');
    }, 1500);
}

function generateInvoiceContent() {
    const { orderId, orderDateTime, customer, address, restaurant, items, billing, tip } = orderData;
    const date = new Date(orderDateTime);
    
    let content = `
========================================
        FOODEXPRESS - TAX INVOICE
========================================

Order ID: ${orderId}
Date: ${formatDateTime(date)}

----------------------------------------
RESTAURANT
----------------------------------------
${restaurant.name}
${restaurant.address}

----------------------------------------
DELIVERY ADDRESS
----------------------------------------
${customer.name}
${buildFullAddress(address)}
Phone: +91 ${customer.phone}

----------------------------------------
ORDER ITEMS
----------------------------------------
`;

    items.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        content += `${item.name}
  Qty: ${item.quantity} x ₹${item.price} = ₹${itemTotal}
`;
        if (item.customization) {
            content += `  (${item.customization})\n`;
        }
    });

    content += `
----------------------------------------
BILL SUMMARY
----------------------------------------
Item Total:          ₹${billing.itemTotal.toFixed(2)}
`;

    if (billing.discount > 0) {
        content += `Discount:           -₹${billing.discount.toFixed(2)}\n`;
    }

    content += `Delivery Fee:        ₹${billing.deliveryFee.toFixed(2)}
Platform Fee:        ₹${billing.platformFee.toFixed(2)}
GST & Taxes:         ₹${billing.tax.toFixed(2)}
`;

    if (tip > 0) {
        content += `Delivery Tip:        ₹${tip.toFixed(2)}\n`;
    }

    const total = billing.grandTotal + (tip || 0);
    content += `
----------------------------------------
GRAND TOTAL:         ₹${total.toFixed(2)}
----------------------------------------

Thank you for ordering with FoodExpress!
For support: support@foodexpress.com

========================================
`;

    return content;
}

function downloadTextAsFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// REFERRAL
// ============================================

function generateReferralCode() {
    if (elements.referralCode) {
        const randomNum = Math.floor(Math.random() * 900) + 100;
        elements.referralCode.textContent = `${CONFIG.REFERRAL_CODE_PREFIX}${randomNum}`;
    }
}

function handleReferShare() {
    const code = elements.referralCode?.textContent || 'FOODIE100';
    const message = `🎉 Hey! I just ordered delicious food from FoodExpress!

Use my referral code *${code}* and get ₹100 OFF on your first order!

Download now and start ordering! 🍔🍕🍜`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// ============================================
// STAR RATING
// ============================================

function setupStarRating() {
    const ratingInputs = elements.starRating.querySelectorAll('input[name="rating"]');
    
    ratingInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const rating = parseInt(e.target.value);
            orderData.rating = rating;
            
            // Update rating text
            const ratingTexts = {
                1: 'We\'re sorry to hear that 😔',
                2: 'We\'ll do better next time',
                3: 'Thanks for your feedback!',
                4: 'Glad you liked it! 😊',
                5: 'Awesome! You made our day! 🎉'
            };
            
            if (elements.ratingText) {
                elements.ratingText.textContent = ratingTexts[rating];
            }
            
            // Show feedback form
            if (elements.feedbackForm) {
                elements.feedbackForm.style.display = 'block';
            }
        });
    });
}

function handleTagClick(tag) {
    tag.classList.toggle('selected');
    
    const tagValue = tag.dataset.tag;
    const index = orderData.feedbackTags.indexOf(tagValue);
    
    if (index > -1) {
        orderData.feedbackTags.splice(index, 1);
    } else {
        orderData.feedbackTags.push(tagValue);
    }
}

function handleSubmitFeedback() {
    orderData.feedback = elements.feedbackText?.value || '';
    
    // Hide form, show thank you
    if (elements.feedbackForm) {
        elements.feedbackForm.style.display = 'none';
    }
    
    if (elements.starRating) {
        elements.starRating.style.display = 'none';
    }
    
    if (elements.ratingText) {
        elements.ratingText.style.display = 'none';
    }
    
    if (elements.feedbackThankyou) {
        elements.feedbackThankyou.style.display = 'block';
    }
    
    // Save feedback (in real app, send to backend)
    saveFeedback();
    
    showToast('success', 'Thank You!', 'Your feedback has been submitted');
}

function saveFeedback() {
    const feedback = {
        orderId: orderData.orderId,
        rating: orderData.rating,
        feedback: orderData.feedback,
        tags: orderData.feedbackTags,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, send to backend)
    const existingFeedback = JSON.parse(localStorage.getItem('foodExpressFeedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('foodExpressFeedback', JSON.stringify(existingFeedback));
}

// ============================================
// CONFETTI ANIMATION
// ============================================

function triggerConfettiAnimation() {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiColors = ['#ff6b35', '#27ae60', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
    const confettiPieces = [];
    const confettiCount = 150;
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 10 - 5,
            opacity: 1
        });
    }
    
    let animationFrame;
    let startTime = Date.now();
    const duration = 4000; // 4 seconds
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(piece => {
            piece.y += piece.speed;
            piece.angle += piece.spin;
            piece.opacity = 1 - progress;
            
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.angle * Math.PI) / 180);
            ctx.globalAlpha = piece.opacity;
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);
            ctx.restore();
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Start animation after delay
    setTimeout(() => {
        animate();
    }, CONFIG.ANIMATION_DELAYS.confetti);
}

// ============================================
// CLEAR CART DATA
// ============================================

function clearCartData() {
    // Clear cart from localStorage
    localStorage.removeItem('foodExpressCart');
    
    // Keep the order data for reference
    // Don't clear 'foodExpressCurrentOrder' yet - user might need it
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check',
        error: 'fa-times',
        info: 'fa-info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 4000);
}

function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
    if (elements.confettiCanvas) {
        elements.confettiCanvas.width = window.innerWidth;
        elements.confettiCanvas.height = window.innerHeight;
    }
});

// ============================================
// SAVE ORDER TO HISTORY
// ============================================

function saveOrderToHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('foodExpressOrderHistory') || '[]');
    
    const historyEntry = {
        ...orderData,
        status: 'confirmed',
        placedAt: new Date().toISOString()
    };
    
    orderHistory.unshift(historyEntry);
    
    // Keep only last 50 orders
    if (orderHistory.length > 50) {
        orderHistory.pop();
    }
    
    localStorage.setItem('foodExpressOrderHistory', JSON.stringify(orderHistory));
}

// Save order to history when page loads
saveOrderToHistory();

// ============================================
// EXPORT FOR TESTING
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        orderData,
        generateOrderId,
        formatDateTime,
        formatPhoneNumber,
        buildFullAddress,
        createShareMessage
    };
}