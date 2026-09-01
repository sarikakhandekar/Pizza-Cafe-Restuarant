/* ============================================
   FOODIEEXPRESS - AUTH PAGES JAVASCRIPT
   Login & Signup Form Handling
   ============================================ */

'use strict';

/* ============================================
   DOM ELEMENTS
   ============================================ */
const DOM = {
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    submitBtn: document.getElementById('submitBtn'),
    toastContainer: document.getElementById('toastContainer'),
    togglePasswordBtns: document.querySelectorAll('.toggle-password'),
    strengthFill: document.getElementById('strengthFill'),
    strengthText: document.getElementById('strengthText')
};

/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    passwordMinLength: 8,
    phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    nameRegex: /^[a-zA-Z\s]{2,30}$/,
    toastDuration: 4000,
    formSubmitDelay: 1500
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, info, warning
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.toastDuration);
}

/**
 * Show error on input field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showError(input, message) {
    const wrapper = input.closest('.input-wrapper');
    const errorElement = wrapper.parentElement.querySelector('.error-message');
    
    wrapper.classList.add('error');
    wrapper.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    
    // Add shake animation
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
}

/**
 * Show success on input field
 * @param {HTMLElement} input - Input element
 */
function showSuccess(input) {
    const wrapper = input.closest('.input-wrapper');
    const errorElement = wrapper.parentElement.querySelector('.error-message');
    
    wrapper.classList.remove('error');
    wrapper.classList.add('success');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

/**
 * Clear input validation state
 * @param {HTMLElement} input - Input element
 */
function clearValidation(input) {
    const wrapper = input.closest('.input-wrapper');
    const errorElement = wrapper.parentElement.querySelector('.error-message');
    
    wrapper.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

/**
 * Set loading state on button
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

/* ============================================
   VALIDATION FUNCTIONS
   ============================================ */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
function validateEmail(email) {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }
    if (!CONFIG.emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
function validatePassword(password) {
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < CONFIG.passwordMinLength) {
        return { valid: false, message: `Password must be at least ${CONFIG.passwordMinLength} characters` };
    }
    return { valid: true, message: '' };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
function validateName(name, fieldName) {
    if (!name) {
        return { valid: false, message: `${fieldName} is required` };
    }
    if (!CONFIG.nameRegex.test(name)) {
        return { valid: false, message: `Please enter a valid ${fieldName.toLowerCase()}` };
    }
    return { valid: true, message: '' };
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
function validatePhone(phone) {
    if (!phone) {
        return { valid: false, message: 'Phone number is required' };
    }
    if (!CONFIG.phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid phone number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} Validation result
 */
function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
        return { valid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: '' };
}

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {object} Strength info
 */
function checkPasswordStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    const levels = {
        0: { level: 'weak', text: 'Very Weak' },
        1: { level: 'weak', text: 'Weak' },
        2: { level: 'fair', text: 'Fair' },
        3: { level: 'good', text: 'Good' },
        4: { level: 'strong', text: 'Strong' },
        5: { level: 'strong', text: 'Very Strong' }
    };
    
    return levels[strength] || levels[0];
}

/**
 * Update password strength indicator
 * @param {string} password - Password to evaluate
 */
function updatePasswordStrength(password) {
    if (!DOM.strengthFill || !DOM.strengthText) return;
    
    const { level, text } = checkPasswordStrength(password);
    
    // Remove all classes
    DOM.strengthFill.className = 'strength-fill';
    DOM.strengthText.className = 'strength-text';
    
    if (password.length > 0) {
        DOM.strengthFill.classList.add(level);
        DOM.strengthText.classList.add(level);
        DOM.strengthText.textContent = text;
    } else {
        DOM.strengthText.textContent = 'Password strength';
    }
}

/* ============================================
   TOGGLE PASSWORD VISIBILITY
   ============================================ */
function initPasswordToggle() {
    DOM.togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/* ============================================
   LOGIN FORM HANDLING
   ============================================ */
function initLoginForm() {
    if (!DOM.loginForm) return;
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Real-time validation
    emailInput.addEventListener('blur', () => {
        const result = validateEmail(emailInput.value.trim());
        if (!result.valid) {
            showError(emailInput, result.message);
        } else {
            showSuccess(emailInput);
        }
    });
    
    emailInput.addEventListener('input', () => {
        clearValidation(emailInput);
    });
    
    passwordInput.addEventListener('blur', () => {
        const result = validatePassword(passwordInput.value);
        if (!result.valid) {
            showError(passwordInput, result.message);
        } else {
            showSuccess(passwordInput);
        }
    });
    
    passwordInput.addEventListener('input', () => {
        clearValidation(passwordInput);
    });
    
    // Form submission
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        let isValid = true;
        
        // Validate email
        const emailResult = validateEmail(email);
        if (!emailResult.valid) {
            showError(emailInput, emailResult.message);
            isValid = false;
        } else {
            showSuccess(emailInput);
        }
        
        // Validate password
        const passwordResult = validatePassword(password);
        if (!passwordResult.valid) {
            showError(passwordInput, passwordResult.message);
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }
        
        if (!isValid) {
            showToast('Please fix the errors above', 'error');
            return;
        }
        
        // Submit form
        setLoading(DOM.submitBtn, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, CONFIG.formSubmitDelay));
            
            // Success
            showToast('Login successful! Redirecting...', 'success');
            
            // Store in session (demo)
            sessionStorage.setItem('user', JSON.stringify({ email }));
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
            setLoading(DOM.submitBtn, false);
        }
    });
}

/* ============================================
   SIGNUP FORM HANDLING
   ============================================ */
function initSignupForm() {
    if (!DOM.signupForm) return;
    
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');
    
    // Real-time validation
    const validationRules = [
        {
            input: firstNameInput,
            validate: () => validateName(firstNameInput.value.trim(), 'First name')
        },
        {
            input: lastNameInput,
            validate: () => validateName(lastNameInput.value.trim(), 'Last name')
        },
        {
            input: emailInput,
            validate: () => validateEmail(emailInput.value.trim())
        },
        {
            input: phoneInput,
            validate: () => validatePhone(phoneInput.value.trim())
        },
        {
            input: passwordInput,
            validate: () => validatePassword(passwordInput.value)
        },
        {
            input: confirmPasswordInput,
            validate: () => validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)
        }
    ];
    
    validationRules.forEach(({ input, validate }) => {
        input.addEventListener('blur', () => {
            const result = validate();
            if (!result.valid) {
                showError(input, result.message);
            } else {
                showSuccess(input);
            }
        });
        
        input.addEventListener('input', () => {
            clearValidation(input);
        });
    });
    
    // Password strength
    passwordInput.addEventListener('input', () => {
        updatePasswordStrength(passwordInput.value);
    });
    
    // Confirm password live check
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
        } else if (confirmPasswordInput.value) {
            showSuccess(confirmPasswordInput);
        }
    });
    
    // Form submission
    DOM.signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        validationRules.forEach(({ input, validate }) => {
            const result = validate();
            if (!result.valid) {
                showError(input, result.message);
                isValid = false;
            } else {
                showSuccess(input);
            }
        });
        
        // Validate terms
        if (!termsInput.checked) {
            const termsError = document.getElementById('termsError');
            if (termsError) {
                termsError.textContent = 'You must agree to the terms and conditions';
                termsError.classList.add('visible');
            }
            isValid = false;
        }
        
        if (!isValid) {
            showToast('Please fix the errors above', 'error');
            return;
        }
        
        // Submit form
        setLoading(DOM.submitBtn, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, CONFIG.formSubmitDelay));
            
            const userData = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                newsletter: document.getElementById('newsletter')?.checked || false
            };
            
            // Success
            showToast('Account created successfully! Redirecting...', 'success');
            
            // Store in session (demo)
            sessionStorage.setItem('user', JSON.stringify(userData));
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            showToast('Registration failed. Please try again.', 'error');
            setLoading(DOM.submitBtn, false);
        }
    });
}

/* ============================================
   SOCIAL LOGIN HANDLING
   ============================================ */
function initSocialLogin() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google') ? 'Google' :
                           btn.classList.contains('facebook') ? 'Facebook' : 'Apple';
            
            showToast(`${provider} login coming soon!`, 'info');
        });
    });
}

/* ============================================
   FORGOT PASSWORD HANDLING
   ============================================ */
function initForgotPassword() {
    const forgotLink = document.querySelector('.forgot-link');
    
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Password reset link sent to your email!', 'info');
        });
    }
}

/* ============================================
   FORM INPUT ANIMATIONS
   ============================================ */
function initInputAnimations() {
    const inputs = document.querySelectorAll('.input-wrapper input');
    
    inputs.forEach(input => {
        // Check if input has value on load
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
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Submit form on Enter (if not in textarea)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            const form = e.target.closest('form');
            if (form && e.target.tagName === 'INPUT') {
                // Don't submit if there are more inputs to fill
                const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"])');
                const currentIndex = Array.from(inputs).indexOf(e.target);
                
                if (currentIndex < inputs.length - 1) {
                    e.preventDefault();
                    inputs[currentIndex + 1].focus();
                }
            }
        }
    });
}

/* ============================================
   FLOATING FOOD PARALLAX
   ============================================ */
function initFloatingFoodParallax() {
    const floatingFoods = document.querySelectorAll('.floating-food');
    
    if (floatingFoods.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        floatingFoods.forEach((food, index) => {
            const speed = (index + 1) * 0.5;
            food.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

/* ============================================
   AUTO-FORMAT PHONE NUMBER
   ============================================ */
function initPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        e.target.value = value;
    });
}

/* ============================================
   REMEMBER ME FUNCTIONALITY
   ============================================ */
function initRememberMe() {
    const rememberMe = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    
    if (!rememberMe || !emailInput) return;
    
    // Check for saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
        emailInput.dispatchEvent(new Event('input'));
    }
    
    // Save email on form submit
    const form = rememberMe.closest('form');
    if (form) {
        form.addEventListener('submit', () => {
            if (rememberMe.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        });
    }
}

/* ============================================
   RIPPLE EFFECT
   ============================================ */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-submit, .social-btn');
    
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
    
    // Add ripple animation styles
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
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   INITIALIZE ALL MODULES
   ============================================ */
function init() {
    // Core functionality
    initPasswordToggle();
    initInputAnimations();
    initKeyboardNav();
    
    // Form handling
    initLoginForm();
    initSignupForm();
    
    // Additional features
    initSocialLogin();
    initForgotPassword();
    initRememberMe();
    initPhoneFormatting();
    
    // Visual effects
    initFloatingFoodParallax();
    initRippleEffect();
    
    console.log('🍕 FoodieExpress Auth initialized!');
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
window.FoodieAuth = {
    showToast,
    validateEmail,
    validatePassword,
    checkPasswordStrength
};