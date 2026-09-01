// ===== Cart Data =====
let cartItems = [
    {
        id: 1,
        name: "Classic Cheese Burger",
        description: "Juicy beef patty with melted cheese, fresh lettuce, tomatoes & special sauce",
        price: 299,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
        badge: "bestseller",
        isVeg: false,
        rating: 4.5
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomato sauce & basil leaves",
        price: 449,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop",
        badge: "popular",
        isVeg: true,
        rating: 4.8
    },
    {
        id: 3,
        name: "Chocolate Milkshake",
        description: "Creamy chocolate shake topped with whipped cream & chocolate chips",
        price: 149,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop",
        badge: null,
        isVeg: true,
        rating: 4.6
    }
];

// ===== Coupon Codes =====
const couponCodes = {
    'SAVE50': { type: 'fixed', value: 50, minOrder: 300, description: '₹50 off on orders above ₹300' },
    'FIRST100': { type: 'fixed', value: 100, minOrder: 500, description: '₹100 off on orders above ₹500' },
    'FREEDEL': { type: 'delivery', value: 0, minOrder: 0, description: 'Free delivery on your order' },
    'FLAT20': { type: 'percentage', value: 20, minOrder: 400, maxDiscount: 150, description: '20% off up to ₹150' }
};

// ===== State Variables =====
let appliedCoupon = null;
let deliveryCharge = 49;
let taxRate = 0.05; // 5% GST

// ===== Initialize Cart =====
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
    initializeEventListeners();
});

// ===== Event Listeners =====
function initializeEventListeners() {
    // Coupon input - Enter key
    const couponInput = document.getElementById('couponInput');
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }

    // Address option selection
    const addressOptions = document.querySelectorAll('.address-option');
    addressOptions.forEach(option => {
        option.addEventListener('click', function() {
            addressOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
}

// ===== Update Quantity =====
function updateQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        // Ask for confirmation before removing
        if (confirm('Remove this item from cart?')) {
            removeItem(itemId);
        }
        return;
    }

    if (newQuantity > 10) {
        showToast('Maximum quantity limit is 10', 'warning');
        return;
    }

    item.quantity = newQuantity;
    
    // Update UI with animation
    const qtyElement = document.getElementById(`qty-${itemId}`);
    const priceElement = document.getElementById(`price-${itemId}`);
    
    if (qtyElement) {
        qtyElement.textContent = newQuantity;
        qtyElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            qtyElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (priceElement) {
        const newPrice = item.price * newQuantity;
        animateValue(priceElement, parseInt(priceElement.textContent), newPrice, 200);
    }

    updateCart();
}

// ===== Remove Item =====
function removeItem(itemId) {
    const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    
    if (itemElement) {
        itemElement.classList.add('removing');
        
        setTimeout(() => {
            cartItems = cartItems.filter(item => item.id !== itemId);
            itemElement.remove();
            updateCart();
            showToast('Item removed from cart');
        }, 300);
    }
}

// ===== Update Cart (Recalculate Everything) =====
function updateCart() {
    updateCartCount();
    updatePriceSummary();
    checkEmptyCart();
    updateCartCountBadge();
}

// ===== Update Cart Count =====
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalItemsElement = document.getElementById('totalItems');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }
}

// ===== Update Cart Count Badge in Header =====
function updateCartCountBadge() {
    const cartCountBadge = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountBadge) {
        cartCountBadge.textContent = totalItems;
    }
}

// ===== Update Price Summary =====
function updatePriceSummary() {
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate delivery
    let delivery = subtotal >= 500 ? 0 : deliveryCharge;
    
    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
        const coupon = couponCodes[appliedCoupon];
        if (coupon) {
            if (subtotal >= coupon.minOrder) {
                switch (coupon.type) {
                    case 'fixed':
                        discount = coupon.value;
                        break;
                    case 'percentage':
                        discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
                        break;
                    case 'delivery':
                        delivery = 0;
                        break;
                }
            }
        }
    }

    // Calculate taxes
    const taxes = Math.round((subtotal - discount) * taxRate);
    
    // Calculate grand total
    const grandTotal = subtotal + delivery + taxes - discount;
    
    // Calculate total savings
    const savings = (subtotal >= 500 ? deliveryCharge : 0) + discount;

    // Update DOM with animations
    animateValue(document.getElementById('subtotal'), 
        parseInt(document.getElementById('subtotal').textContent), subtotal, 300);
    
    // Update delivery display
    const originalDelivery = document.getElementById('originalDelivery');
    const deliveryText = document.getElementById('deliveryText');
    
    if (subtotal >= 500 || (appliedCoupon && couponCodes[appliedCoupon]?.type === 'delivery')) {
        originalDelivery.style.display = 'inline';
        deliveryText.textContent = 'FREE';
        deliveryText.className = 'free';
    } else {
        originalDelivery.style.display = 'none';
        deliveryText.textContent = `₹${deliveryCharge}`;
        deliveryText.className = '';
    }

    animateValue(document.getElementById('taxes'), 
        parseInt(document.getElementById('taxes').textContent), taxes, 300);
    
    // Update discount row
    const discountRow = document.getElementById('discountRow');
    const discountElement = document.getElementById('discount');
    
    if (discount > 0) {
        discountRow.style.display = 'flex';
        animateValue(discountElement, parseInt(discountElement.textContent) || 0, discount, 300);
    } else {
        discountRow.style.display = 'none';
    }

    animateValue(document.getElementById('grandTotal'), 
        parseInt(document.getElementById('grandTotal').textContent), grandTotal, 300);

    // Update savings banner
    const savingsBanner = document.getElementById('savingsBanner');
    const totalSavings = document.getElementById('totalSavings');
    
    if (savings > 0) {
        savingsBanner.style.display = 'flex';
        totalSavings.textContent = savings;
    } else {
        savingsBanner.style.display = 'none';
    }
}

// ===== Apply Coupon =====
function applyCoupon() {
    const input = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showCouponMessage('Please enter a coupon code', 'error');
        return;
    }

    const coupon = couponCodes[code];
    
    if (!coupon) {
        showCouponMessage('Invalid coupon code. Please try again.', 'error');
        input.value = '';
        appliedCoupon = null;
        updateCart();
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < coupon.minOrder) {
        showCouponMessage(`Add items worth ₹${coupon.minOrder - subtotal} more to use this coupon`, 'error');
        return;
    }

    appliedCoupon = code;
    showCouponMessage(`🎉 Coupon applied! ${coupon.description}`, 'success');
    input.disabled = true;
    
    // Change apply button to remove
    const applyBtn = document.querySelector('.apply-btn');
    applyBtn.textContent = 'Remove';
    applyBtn.onclick = removeCoupon;
    applyBtn.style.background = 'var(--gray-600)';

    updateCart();
}

// ===== Remove Coupon =====
function removeCoupon() {
    const input = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    
    appliedCoupon = null;
    input.value = '';
    input.disabled = false;
    message.style.display = 'none';
    message.className = 'coupon-message';

    // Reset apply button
    const applyBtn = document.querySelector('.apply-btn');
    applyBtn.textContent = 'Apply';
    applyBtn.onclick = applyCoupon;
    applyBtn.style.background = '';

    updateCart();
    showToast('Coupon removed');
}

// ===== Show Coupon Message =====
function showCouponMessage(text, type) {
    const message = document.getElementById('couponMessage');
    message.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;
    message.className = `coupon-message ${type}`;
    message.style.display = 'flex';
}

// ===== Check Empty Cart =====
function checkEmptyCart() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    const pageHeader = document.querySelector('.page-header');

    if (cartItems.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        pageHeader.querySelector('.item-count').textContent = 'Your cart is empty';
    } else {
        cartContainer.style.display = 'grid';
        emptyCart.style.display = 'none';
    }
}

// ===== Change Address =====
function changeAddress() {
    const modal = document.getElementById('addressModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ===== Close Modal =====
function closeModal() {
    const modal = document.getElementById('addressModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== Save Address =====
function saveAddress() {
    const selectedAddress = document.querySelector('.address-option.selected .addr-text');
    if (selectedAddress) {
        const addressText = document.querySelector('.address-text');
        addressText.innerHTML = selectedAddress.textContent.replace(', ', ',<br>');
        showToast('Delivery address updated');
    }
    closeModal();
}

// ===== Add Tip =====
function addTip() {
    const tip = prompt('Enter tip amount (₹):');
    if (tip && !isNaN(tip) && tip > 0) {
        showToast(`₹${tip} tip added for delivery partner! 💝`);
    }
}

// ===== Proceed to Checkout =====
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Add loading state
    const checkoutBtn = document.querySelector('.btn-primary');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    checkoutBtn.disabled = true;

    setTimeout(() => {
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
        showToast('Redirecting to checkout...', 'success');
        
        // Here you would typically redirect to checkout page
        // window.location.href = '/checkout';
    }, 1500);
}

// ===== Show Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');

    toastMessage.textContent = message;
    
    // Update icon based on type
    toastIcon.className = 'fas';
    switch(type) {
        case 'success':
            toastIcon.classList.add('fa-check-circle');
            toastIcon.style.color = 'var(--success-color)';
            break;
        case 'error':
            toastIcon.classList.add('fa-exclamation-circle');
            toastIcon.style.color = 'var(--error-color)';
            break;
        case 'warning':
            toastIcon.classList.add('fa-exclamation-triangle');
            toastIcon.style.color = 'var(--warning-color)';
            break;
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Animate Value (Number Counter) =====
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + range * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Close modal when clicking outside =====
document.addEventListener('click', function(e) {
    const modal = document.getElementById('addressModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ===== Keyboard accessibility =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== Add to cart function (for empty cart browse button) =====
function addToCart(item) {
    const existingItem = cartItems.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({...item, quantity: 1});
    }
    
    // Reload page or update UI
    location.reload();
}

// ===== Format Currency =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// ===== Debounce Function =====
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

// ===== Console welcome message =====
console.log('%c🍔 FoodieExpress Cart Page', 'font-size: 20px; font-weight: bold; color: #ff6b35;');
console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 12px; color: #666;');