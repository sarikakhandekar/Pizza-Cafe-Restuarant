/* ============================================
   FOODIEEXPRESS - LOGIN PAGE JAVASCRIPT
   Modern, Interactive Login Form
   ============================================ */

'use strict';

/* ============================================
   DOM ELEMENTS
   ============================================ */
const DOM = {
    // Form Elements
    loginForm: document.getElementById('loginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    rememberMe: document.getElementById('rememberMe'),
    submitBtn: document.getElementById('submitBtn'),
    
    // Input Groups
    emailGroup: document.getElementById('emailGroup'),
    passwordGroup: document.getElementById('passwordGroup'),
    
    // Error Elements
    emailError: document.getElementById('emailError'),
    passwordError: document.getElementById('passwordError'),
    
    // Other Elements
    passwordToggle: document.getElementById('passwordToggle'),
    forgotPassword: document.getElementById('forgotPassword'),
    toastContainer: document.getElementById('toastContainer'),
    
    // Modal Elements
    forgotModal: document.getElementById('forgotModal'),
    modalClose: document.getElementById('modalClose'),
    forgotForm: document.getElementById('forgotForm'),
    forgotEmail: document.getElementById('forgotEmail'),
    forgotEmailError: document.getElementById('forgotEmailError'),
    
    // Social Buttons
    googleLogin: document.getElementById('googleLogin'),
    facebookLogin: document.getElementById('facebookLogin'),
    appleLogin: document.getElementById('appleLogin')
};

/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    minPasswordLength: 6,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    toastDuration: 4000,
    submitDelay: 1500,
    redirectDelay: 1000
};

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */
const Toast = {
    /**
     * Show a toast notification
     * @param {Object} options - Toast options
     * @param {string} options.title - Toast title
     * @param {string} options.message - Toast message
     * @param {string} options.type - Toast type: success, error, info, warning
     * @param {number} options.duration - Duration in ms
     */
    show({ title, message, type = 'info', duration = CONFIG.toastDuration }) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
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
        
        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide(toast));
        
        // Auto hide
        setTimeout(() => this.hide(toast), duration);
        
        return toast;
    },
    
    /**
     * Hide a toast notification
     * @param {HTMLElement} toast - Toast element
     */
    hide(toast) {
        if (!toast || toast.classList.contains('hiding')) return;
        
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }
};

/* ============================================
   FORM VALIDATION
   ============================================ */
const Validator = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {Object} Validation result
     */
    validateEmail(email) {
        if (!email || !email.trim()) {
            return { valid: false, message: 'Email address is required' };
        }
        if (!CONFIG.emailRegex.test(email.trim())) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        return { valid: true, message: '' };
    },
    
    /**
     * Validate password
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword(password) {
        if (!password) {
            return { valid: false, message: 'Password is required' };
        }
        if (password.length < CONFIG.minPasswordLength) {
            return { valid: false, message: `Password must be at least ${CONFIG.minPasswordLength} characters` };
        }
        return { valid: true, message: '' };
    }
};

/* ============================================
   UI HELPERS
   ============================================ */
const UI = {
    /**
     * Show error on input group
     * @param {HTMLElement} group - Input group element
     * @param {HTMLElement} errorEl - Error message element
     * @param {string} message - Error message
     */
    showError(group, errorEl, message) {
        group.classList.add('error');
        group.classList.remove('success');
        
        const errorSpan = errorEl.querySelector('span');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        
        // Shake animation
        const input = group.querySelector('input');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    },
    
    /**
     * Show success on input group
     * @param {HTMLElement} group - Input group element
     */
    showSuccess(group) {
        group.classList.remove('error');
        group.classList.add('success');
    },
    
    /**
     * Clear validation state
     * @param {HTMLElement} group - Input group element
     */
    clearValidation(group) {
        group.classList.remove('error', 'success');
    },
    
    /**
     * Set loading state on button
     * @param {HTMLElement} btn - Button element
     * @param {boolean} loading - Loading state
     */
    setLoading(btn, loading) {
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
};

/* ============================================
   PASSWORD TOGGLE
   ============================================ */
function initPasswordToggle() {
    DOM.passwordToggle.addEventListener('click', () => {
        const input = DOM.passwordInput;
        const icon = DOM.passwordToggle.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
        
        input.focus();
    });
}

/* ============================================
   REAL-TIME VALIDATION
   ============================================ */
function initRealTimeValidation() {
    // Email validation
    DOM.emailInput.addEventListener('blur', () => {
        const result = Validator.validateEmail(DOM.emailInput.value);
        if (!result.valid) {
            UI.showError(DOM.emailGroup, DOM.emailError, result.message);
        } else {
            UI.showSuccess(DOM.emailGroup);
        }
    });
    
    DOM.emailInput.addEventListener('input', () => {
        UI.clearValidation(DOM.emailGroup);
    });
    
    // Password validation
    DOM.passwordInput.addEventListener('blur', () => {
        const result = Validator.validatePassword(DOM.passwordInput.value);
        if (!result.valid) {
            UI.showError(DOM.passwordGroup, DOM.passwordError, result.message);
        } else {
            UI.showSuccess(DOM.passwordGroup);
        }
    });
    
    DOM.passwordInput.addEventListener('input', () => {
        UI.clearValidation(DOM.passwordGroup);
    });
}

/* ============================================
   FORM SUBMISSION
   ============================================ */
function initFormSubmission() {
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = DOM.emailInput.value.trim();
        const password = DOM.passwordInput.value;
        const rememberMe = DOM.rememberMe.checked;
        
        let isValid = true;
        
        // Validate email
        const emailResult = Validator.validateEmail(email);
        if (!emailResult.valid) {
            UI.showError(DOM.emailGroup, DOM.emailError, emailResult.message);
            isValid = false;
        } else {
            UI.showSuccess(DOM.emailGroup);
        }
        
        // Validate password
        const passwordResult = Validator.validatePassword(password);
        if (!passwordResult.valid) {
            UI.showError(DOM.passwordGroup, DOM.passwordError, passwordResult.message);
            isValid = false;
        } else {
            UI.showSuccess(DOM.passwordGroup);
        }
        
        if (!isValid) {
            Toast.show({
                title: 'Validation Error',
                message: 'Please fix the errors above',
                type: 'error'
            });
            return;
        }
        
        // Start loading
        UI.setLoading(DOM.submitBtn, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, CONFIG.submitDelay));
            
            // Handle "Remember Me"
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Store session (demo)
            sessionStorage.setItem('user', JSON.stringify({ 
                email, 
                loggedIn: true,
                timestamp: Date.now()
            }));
            
            // Success toast
            Toast.show({
                title: 'Welcome Back!',
                message: 'Login successful. Redirecting...',
                type: 'success'
            });
            
            // Redirect
            setTimeout(() => {
                window.location.href = 'index.html';
            }, CONFIG.redirectDelay);
            
        } catch (error) {
            Toast.show({
                title: 'Login Failed',
                message: 'Invalid email or password. Please try again.',
                type: 'error'
            });
            UI.setLoading(DOM.submitBtn, false);
        }
    });
}

/* ============================================
   REMEMBER ME
   ============================================ */
function initRememberMe() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedEmail) {
        DOM.emailInput.value = savedEmail;
        DOM.rememberMe.checked = true;
        
        // Trigger the floating label
        DOM.emailInput.dispatchEvent(new Event('input'));
    }
}

/* ============================================
   FORGOT PASSWORD MODAL
   ============================================ */
function initForgotPasswordModal() {
    // Open modal
    DOM.forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        DOM.forgotModal.classList.add('active');
        DOM.forgotEmail.focus();
    });
    
    // Close modal
    DOM.modalClose.addEventListener('click', () => {
        DOM.forgotModal.classList.remove('active');
    });
    
    // Close on overlay click
    DOM.forgotModal.addEventListener('click', (e) => {
        if (e.target === DOM.forgotModal) {
            DOM.forgotModal.classList.remove('active');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.forgotModal.classList.contains('active')) {
            DOM.forgotModal.classList.remove('active');
        }
    });
    
    // Form submission
    DOM.forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = DOM.forgotEmail.value.trim();
        const result = Validator.validateEmail(email);
        
        const inputGroup = DOM.forgotEmail.closest('.input-group');
        
        if (!result.valid) {
            inputGroup.classList.add('error');
            const errorSpan = DOM.forgotEmailError.querySelector('span');
            if (errorSpan) errorSpan.textContent = result.message;
            return;
        }
        
        inputGroup.classList.remove('error');
        
        // Get submit button
        const submitBtn = DOM.forgotForm.querySelector('.submit-btn');
        UI.setLoading(submitBtn, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            DOM.forgotModal.classList.remove('active');
            DOM.forgotEmail.value = '';
            
            Toast.show({
                title: 'Reset Link Sent!',
                message: 'Check your email for password reset instructions.',
                type: 'success'
            });
            
        } catch (error) {
            Toast.show({
                title: 'Error',
                message: 'Failed to send reset link. Please try again.',
                type: 'error'
            });
        } finally {
            UI.setLoading(submitBtn, false);
        }
    });
    
    // Clear validation on input
    DOM.forgotEmail.addEventListener('input', () => {
        DOM.forgotEmail.closest('.input-group').classList.remove('error');
    });
}

/* ============================================
   SOCIAL LOGIN BUTTONS
   ============================================ */
function initSocialLogin() {
    const socialButtons = [
        { element: DOM.googleLogin, provider: 'Google' },
        { element: DOM.facebookLogin, provider: 'Facebook' },
        { element: DOM.appleLogin, provider: 'Apple' }
    ];
    
    socialButtons.forEach(({ element, provider }) => {
        if (!element) return;
        
        element.addEventListener('click', () => {
            Toast.show({
                title: `${provider} Login`,
                message: `${provider} authentication coming soon!`,
                type: 'info'
            });
        });
    });
}

/* ============================================
   INPUT ANIMATIONS
   ============================================ */
function initInputAnimations() {
    const inputs = document.querySelectorAll('.input-wrapper input');
    
    inputs.forEach(input => {
        // Check initial value
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Enter to move to next input
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (!form) return;
            
            const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"])');
            const currentIndex = Array.from(inputs).indexOf(e.target);
            
            if (currentIndex < inputs.length - 1) {
                e.preventDefault();
                inputs[currentIndex + 1].focus();
            }
        }
    });
}

/* ============================================
   FLOATING FOOD PARALLAX
   ============================================ */
function initParallax() {
    const floatingFoods = document.querySelectorAll('.floating-food');
    
    if (floatingFoods.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 15;
                const y = (e.clientY / window.innerHeight - 0.5) * 15;
                
                floatingFoods.forEach((food, index) => {
                    const speed = (index % 3 + 1) * 0.4;
                    food.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

/* ============================================
   RIPPLE EFFECT
   ============================================ */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.submit-btn, .social-btn');
    
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
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation keyframes
    if (!document.getElementById('ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   SESSION CHECK
   ============================================ */
function checkSession() {
    const user = sessionStorage.getItem('user');
    
    if (user) {
        const userData = JSON.parse(user);
        
        // Check if session is still valid (e.g., within 24 hours)
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (Date.now() - userData.timestamp < sessionDuration) {
            Toast.show({
                title: 'Already Logged In',
                message: 'Redirecting to homepage...',
                type: 'info'
            });
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
            return true;
        } else {
            // Session expired
            sessionStorage.removeItem('user');
        }
    }
    
    return false;
}

/* ============================================
   DEMO CREDENTIALS HINT
   ============================================ */
function initDemoHint() {
    // For demo purposes - you can remove this in production
    const demoCredentials = {
        email: 'demo@foodieexpress.com',
        password: 'demo123'
    };
    
    // Show hint after 5 seconds if fields are empty
    setTimeout(() => {
        if (!DOM.emailInput.value && !DOM.passwordInput.value) {
            Toast.show({
                title: '💡 Demo Hint',
                message: `Try: ${demoCredentials.email} / ${demoCredentials.password}`,
                type: 'info',
                duration: 8000
            });
        }
    }, 5000);
}

/* ============================================
   INITIALIZE APPLICATION
   ============================================ */
function init() {
    // Check existing session
    if (checkSession()) return;
    
    // Core functionality
    initPasswordToggle();
    initRealTimeValidation();
    initFormSubmission();
    initRememberMe();
    initForgotPasswordModal();
    
    // Social login
    initSocialLogin();
    
    // UI enhancements
    initInputAnimations();
    initKeyboardNavigation();
    initRippleEffect();
    
    // Visual effects
    initParallax();
    
    // Demo hint (remove in production)
    initDemoHint();
    
    console.log('🍕 FoodieExpress Login initialized!');
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
window.FoodieLogin = {
    Toast,
    Validator,
    UI
};