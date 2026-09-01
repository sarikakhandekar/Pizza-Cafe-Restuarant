  // ==========================================
        // PAYMENT PAGE - MAIN JAVASCRIPT
        // ==========================================

        // Global Variables
        let selectedPaymentMethod = 'cod';
        let selectedUpiApp = null;
        let orderData = null;

        // ==========================================
        // INITIALIZATION
        // ==========================================

        document.addEventListener('DOMContentLoaded', function() {
            // Check for direct access protection
            checkDirectAccess();
            
            // Load order data from localStorage
            loadOrderData();
            
            // Pre-select payment method from checkout
            preselectPaymentMethod();
            
            // Initialize event listeners
            initEventListeners();
        });

        // Direct Access Protection
        function checkDirectAccess() {
            const orderDataStr = localStorage.getItem('ORDER_DATA');
            if (!orderDataStr) {
                // No order data found, redirect to checkout
                console.warn('No order data found. Redirecting to checkout...');
                window.location.href = 'checkout.html';
                return;
            }
        }

        // Load Order Data from localStorage
        function loadOrderData() {
            const orderDataStr = localStorage.getItem('ORDER_DATA');
            
            if (orderDataStr) {
                try {
                    orderData = JSON.parse(orderDataStr);
                    displayOrderSummary(orderData);
                } catch (e) {
                    console.error('Error parsing order data:', e);
                    // Use fallback demo data
                    loadDemoOrderData();
                }
            } else {
                // Use demo data for testing
                loadDemoOrderData();
            }
        }

        // Demo Order Data (for testing without localStorage)
        function loadDemoOrderData() {
            orderData = {
                items: [
                    { name: 'Margherita Pizza', quantity: 2, price: 299, isVeg: true },
                    { name: 'Chicken Burger', quantity: 1, price: 199, isVeg: false },
                    { name: 'French Fries', quantity: 2, price: 99, isVeg: true },
                    { name: 'Cold Coffee', quantity: 2, price: 79, isVeg: true }
                ],
                itemTotal: 1153,
                deliveryFee: 40,
                taxes: 58,
                discount: 100,
                tip: 20,
                grandTotal: 1171,
                paymentMethod: 'upi',
                deliveryAddress: {
                    type: 'Home',
                    fullAddress: '123, Green Valley Apartments, Sector 42, Gurugram, Haryana - 122001'
                }
            };
            displayOrderSummary(orderData);
        }

        // Display Order Summary
        function displayOrderSummary(data) {
            const summaryItems = document.getElementById('summaryItems');
            
            // Clear existing items
            summaryItems.innerHTML = '';
            
            // Add items
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const itemHtml = `
                        <div class="summary-item">
                            <span class="item-quantity">${item.quantity}×</span>
                            <span class="item-name">
                                <span class="${item.isVeg ? 'veg-icon' : 'non-veg-icon'}"></span>
                                ${item.name}
                            </span>
                            <span class="item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                    `;
                    summaryItems.innerHTML += itemHtml;
                });
            }
            
            // Update breakdown
            document.getElementById('itemTotal').textContent = `₹${data.itemTotal?.toLocaleString('en-IN') || '0'}`;
            document.getElementById('deliveryFee').textContent = data.deliveryFee === 0 ? 'FREE' : `₹${data.deliveryFee?.toLocaleString('en-IN') || '0'}`;
            document.getElementById('taxes').textContent = `₹${data.taxes?.toLocaleString('en-IN') || '0'}`;
            
            // Discount
            if (data.discount && data.discount > 0) {
                document.getElementById('discountRow').style.display = 'flex';
                document.getElementById('discount').textContent = `-₹${data.discount.toLocaleString('en-IN')}`;
            }
            
            // Tip
            if (data.tip && data.tip > 0) {
                document.getElementById('tipRow').style.display = 'flex';
                document.getElementById('tip').textContent = `₹${data.tip.toLocaleString('en-IN')}`;
            }
            
            // Grand Total
            document.getElementById('grandTotal').textContent = `₹${data.grandTotal?.toLocaleString('en-IN') || '0'}`;
            document.getElementById('payAmount').textContent = `• ₹${data.grandTotal?.toLocaleString('en-IN') || '0'}`;
            
            // Delivery Address
            if (data.deliveryAddress) {
                document.getElementById('deliveryAddress').innerHTML = `
                    <strong>${data.deliveryAddress.type || 'Address'}</strong><br>
                    ${data.deliveryAddress.fullAddress || 'Address not provided'}
                `;
            }
        }

        // Pre-select payment method from checkout
        function preselectPaymentMethod() {
            const savedMethod = orderData?.paymentMethod || localStorage.getItem('SELECTED_PAYMENT_METHOD') || 'cod';
            selectPaymentMethod(savedMethod);
        }

        // ==========================================
        // PAYMENT METHOD SELECTION
        // ==========================================

        function selectPaymentMethod(method) {
            // Remove selection from all options
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Select the clicked option
            const selectedOption = document.querySelector(`.payment-option[data-method="${method}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
            
            selectedPaymentMethod = method;
            
            // Update button text based on method
            updatePayButton(method);
            
            // Save selection
            localStorage.setItem('SELECTED_PAYMENT_METHOD', method);
        }

        function updatePayButton(method) {
            const payBtnText = document.getElementById('payBtnText');
            
            switch(method) {
                case 'cod':
                    payBtnText.innerHTML = '<i class="fas fa-shopping-bag"></i><span>Place Order</span>';
                    break;
                case 'upi':
                    payBtnText.innerHTML = '<i class="fas fa-mobile-alt"></i><span>Pay Now</span>';
                    break;
                case 'card':
                    payBtnText.innerHTML = '<i class="fas fa-lock"></i><span>Pay Securely</span>';
                    break;
            }
        }

        // UPI App Selection
        function selectUpiApp(event, app) {
            event.stopPropagation();
            
            document.querySelectorAll('.upi-app').forEach(upiApp => {
                upiApp.classList.remove('selected');
            });
            
            document.querySelector(`.upi-app[data-app="${app}"]`).classList.add('selected');
            selectedUpiApp = app;
            
            // Clear UPI ID field if an app is selected
            if (app !== 'other') {
                document.getElementById('upiId').value = '';
                document.getElementById('upiError').classList.remove('show');
            }
        }

        // Saved Card Selection
        function selectSavedCard(cardElement) {
            document.querySelectorAll('.saved-card').forEach(card => {
                card.classList.remove('selected');
            });
            cardElement.classList.add('selected');
        }

        // ==========================================
        // INPUT FORMATTING & VALIDATION
        // ==========================================

        // Format Card Number (add spaces)
        function formatCardNumber(input) {
            let value = input.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
            let formatted = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            input.value = formatted;
            
            // Validate
            const cleanNumber = value.replace(/\s/g, '');
            const errorElement = document.getElementById('cardNumberError');
            
            if (cleanNumber.length > 0 && cleanNumber.length !== 16) {
                input.classList.add('error');
                input.classList.remove('success');
            } else if (cleanNumber.length === 16) {
                input.classList.remove('error');
                input.classList.add('success');
                errorElement.classList.remove('show');
            } else {
                input.classList.remove('error', 'success');
            }
        }

        // Detect Card Type
        function detectCardType() {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const iconElement = document.getElementById('cardTypeIcon');
            
            if (cardNumber.startsWith('4')) {
                iconElement.className = 'fab fa-cc-visa card-type-icon visa';
            } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
                iconElement.className = 'fab fa-cc-mastercard card-type-icon mastercard';
            } else if (cardNumber.startsWith('3')) {
                iconElement.className = 'fab fa-cc-amex card-type-icon amex';
            } else {
                iconElement.className = 'card-type-icon';
            }
        }

        // Format Expiry Date
        function formatExpiryDate(input) {
            let value = input.value.replace(/[^0-9]/g, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            input.value = value;
            
            // Validate
            const errorElement = document.getElementById('expiryError');
            if (value.length === 5) {
                const [month, year] = value.split('/');
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;
                
                if (parseInt(month) > 12 || parseInt(month) < 1 || 
                    (parseInt(year) < currentYear) || 
                    (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    input.classList.add('error');
                    errorElement.classList.add('show');
                } else {
                    input.classList.remove('error');
                    input.classList.add('success');
                    errorElement.classList.remove('show');
                }
            } else {
                input.classList.remove('error', 'success');
                errorElement.classList.remove('show');
            }
        }

        // Validate CVV
        function validateCvv() {
            const cvv = document.getElementById('cvv');
            const errorElement = document.getElementById('cvvError');
            const value = cvv.value.replace(/[^0-9]/g, '');
            cvv.value = value;
            
            if (value.length > 0 && value.length < 3) {
                cvv.classList.add('error');
            } else if (value.length >= 3) {
                cvv.classList.remove('error');
                cvv.classList.add('success');
                errorElement.classList.remove('show');
            } else {
                cvv.classList.remove('error', 'success');
            }
        }

        // Validate Card Name
        function validateCardName() {
            const cardName = document.getElementById('cardName');
            const errorElement = document.getElementById('cardNameError');
            const value = cardName.value.trim();
            
            if (value.length > 0 && value.length < 3) {
                cardName.classList.add('error');
            } else if (value.length >= 3) {
                cardName.classList.remove('error');
                cardName.classList.add('success');
                errorElement.classList.remove('show');
            } else {
                cardName.classList.remove('error', 'success');
            }
        }

        // Validate UPI ID
        function validateUpiId() {
            const upiId = document.getElementById('upiId');
            const errorElement = document.getElementById('upiError');
            const value = upiId.value.trim();
            
            // UPI ID pattern: username@provider
            const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
            
            if (value.length > 0 && !upiPattern.test(value)) {
                upiId.classList.add('error');
                upiId.classList.remove('success');
            } else if (upiPattern.test(value)) {
                upiId.classList.remove('error');
                upiId.classList.add('success');
                errorElement.classList.remove('show');
                // Clear UPI app selection when typing
                document.querySelectorAll('.upi-app').forEach(app => {
                    app.classList.remove('selected');
                });
                selectedUpiApp = null;
            } else {
                upiId.classList.remove('error', 'success');
            }
        }

        // ==========================================
        // PAYMENT PROCESSING
        // ==========================================

        function processPayment() {
            // Validate based on payment method
            if (!validatePaymentDetails()) {
                return;
            }
            
            // Show loading overlay
            showLoadingOverlay();
            
            // Simulate payment processing
            simulatePaymentProcess();
        }

        function validatePaymentDetails() {
            let isValid = true;
            
            switch(selectedPaymentMethod) {
                case 'cod':
                    // No validation needed for COD
                    break;
                    
                case 'upi':
                    const upiId = document.getElementById('upiId').value.trim();
                    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
                    
                    if (!selectedUpiApp && !upiPattern.test(upiId)) {
                        document.getElementById('upiId').classList.add('error');
                        document.getElementById('upiError').classList.add('show');
                        isValid = false;
                        showToast('Please select a UPI app or enter a valid UPI ID', 'error');
                    }
                    break;
                    
                case 'card':
                    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
                    const expiryDate = document.getElementById('expiryDate').value;
                    const cvv = document.getElementById('cvv').value;
                    const cardName = document.getElementById('cardName').value.trim();
                    
                    if (cardNumber.length !== 16) {
                        document.getElementById('cardNumber').classList.add('error');
                        document.getElementById('cardNumberError').classList.add('show');
                        isValid = false;
                    }
                    
                    if (expiryDate.length !== 5) {
                        document.getElementById('expiryDate').classList.add('error');
                        document.getElementById('expiryError').classList.add('show');
                        isValid = false;
                    }
                    
                    if (cvv.length < 3) {
                        document.getElementById('cvv').classList.add('error');
                        document.getElementById('cvvError').classList.add('show');
                        isValid = false;
                    }
                    
                    if (cardName.length < 3) {
                        document.getElementById('cardName').classList.add('error');
                        document.getElementById('cardNameError').classList.add('show');
                        isValid = false;
                    }
                    
                    if (!isValid) {
                        showToast('Please fill in all card details correctly', 'error');
                    }
                    break;
            }
            
            return isValid;
        }

        function showLoadingOverlay() {
            const overlay = document.getElementById('loadingOverlay');
            overlay.classList.add('active');
            
            // Update title based on payment method
            const title = document.getElementById('loadingTitle');
            if (selectedPaymentMethod === 'cod') {
                title.textContent = 'Confirming Order';
            } else {
                title.textContent = 'Processing Payment';
            }
        }

        function simulatePaymentProcess() {
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');
            
            // Step 1: Verifying (already active)
            step1.classList.add('active');
            
            // Step 2 after 1 second
            setTimeout(() => {
                step1.classList.remove('active');
                step1.classList.add('completed');
                step1.innerHTML = '<i class="fas fa-check-circle"></i><span>Payment details verified</span>';
                
                step2.classList.add('active');
                step2.innerHTML = '<div class="spinner-small"></div><span>Processing transaction...</span>';
            }, 1000);
            
            // Step 3 after 2 seconds
            setTimeout(() => {
                step2.classList.remove('active');
                step2.classList.add('completed');
                step2.innerHTML = '<i class="fas fa-check-circle"></i><span>Transaction successful</span>';
                
                step3.classList.add('active');
                step3.innerHTML = '<div class="spinner-small"></div><span>Confirming order...</span>';
            }, 2000);
            
            // Complete after 3 seconds
            setTimeout(() => {
                step3.classList.remove('active');
                step3.classList.add('completed');
                step3.innerHTML = '<i class="fas fa-check-circle"></i><span>Order confirmed!</span>';
                
                // Save payment status and order details
                savePaymentData();
                
                // Redirect to success page
                setTimeout(() => {
                    window.location.href = 'confirmation.html   ';
                }, 500);
            }, 3000);
        }

        function savePaymentData() {
            // Save payment status
            localStorage.setItem('PAYMENT_STATUS', 'success');
            
            // Save complete order data
            const paymentData = {
                orderId: generateOrderId(),
                orderDate: new Date().toISOString(),
                paymentMethod: selectedPaymentMethod,
                paymentStatus: 'success',
                ...orderData
            };
            
            localStorage.setItem('COMPLETED_ORDER', JSON.stringify(paymentData));
            
            // Clear cart data after successful payment
            // localStorage.removeItem('CART_DATA');
            // localStorage.removeItem('ORDER_DATA');
        }

        function generateOrderId() {
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `FE${timestamp}${random}`;
        }

        // ==========================================
        // UTILITY FUNCTIONS
        // ==========================================

        function goBack() {
            window.location.href = 'checkout.html';
        }

        function showToast(message, type = 'info') {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;
            
            // Add styles
            toast.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1001;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Add toast animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);

        // Initialize event listeners
        function initEventListeners() {
            // Prevent form submission on Enter key in inputs
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        processPayment();
                    }
                });
            });
        }

        // ==========================================
        // FOR TESTING - DEMO DATA INITIALIZATION
        // ==========================================

        // If no ORDER_DATA exists, create demo data for testing
        if (!localStorage.getItem('ORDER_DATA')) {
            const demoOrderData = {
                items: [
                    { name: 'Margherita Pizza', quantity: 2, price: 299, isVeg: true },
                    { name: 'Chicken Burger', quantity: 1, price: 199, isVeg: false },
                    { name: 'French Fries', quantity: 2, price: 99, isVeg: true },
                    { name: 'Cold Coffee', quantity: 2, price: 79, isVeg: true }
                ],
                itemTotal: 1153,
                deliveryFee: 40,
                taxes: 58,
                discount: 100,
                tip: 20,
                grandTotal: 1171,
                paymentMethod: 'upi',
                deliveryAddress: {
                    type: 'Home',
                    fullAddress: '123, Green Valley Apartments, Sector 42, Gurugram, Haryana - 122001'
                }
            };
            localStorage.setItem('ORDER_DATA', JSON.stringify(demoOrderData));
        }