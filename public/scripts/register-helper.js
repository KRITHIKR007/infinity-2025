/**
 * Helper functions for the registration page
 */

// Event selection helpers
export function toggleEventSelection(eventCard) {
    if (!eventCard) return false;
    
    // Get the checkbox
    const checkbox = eventCard.querySelector('.event-checkbox-input');
    if (!checkbox) return false;
    
    // Toggle checkbox state
    checkbox.checked = !checkbox.checked;
    
    // Trigger change event on checkbox
    const changeEvent = new Event('change', { bubbles: true });
    checkbox.dispatchEvent(changeEvent);
    
    return checkbox.checked;
}

// Event card helpers
export function markCardAsSelected(eventCard, isSelected) {
    if (!eventCard) return;
    
    if (isSelected) {
        eventCard.classList.add('selected');
        const checkboxSpan = eventCard.querySelector('.event-checkbox span');
        if (checkboxSpan) {
            checkboxSpan.classList.add('bg-purple-600');
            checkboxSpan.classList.remove('border-gray-500');
        }
    } else {
        eventCard.classList.remove('selected');
        const checkboxSpan = eventCard.querySelector('.event-checkbox span');
        if (checkboxSpan) {
            checkboxSpan.classList.remove('bg-purple-600');
            checkboxSpan.classList.add('border-gray-500');
        }
    }
}

// Form navigation helpers
export function navigateToFormStep(step) {
    // Get all form steps
    const formSteps = document.querySelectorAll('.form-step');
    
    // Hide all steps
    formSteps.forEach(formStep => {
        formStep.classList.remove('active');
        formStep.style.display = 'none';
    });
    
    // Show the target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
        
        // Update step indicators
        updateStepIndicators(step);
        
        return true;
    }
    
    return false;
}

// Update step indicators
function updateStepIndicators(currentStep) {
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    stepIndicators.forEach((indicator, index) => {
        // Convert from 0-based index to 1-based step number
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            // Completed steps
            indicator.classList.remove('bg-gray-700', 'bg-purple-600');
            indicator.classList.add('bg-green-600');
            indicator.innerHTML = '<i class="fas fa-check"></i>';
        } else if (stepNumber === currentStep) {
            // Current step
            indicator.classList.remove('bg-gray-700', 'bg-green-600');
            indicator.classList.add('bg-purple-600');
            indicator.textContent = stepNumber;
        } else {
            // Future steps
            indicator.classList.remove('bg-purple-600', 'bg-green-600');
            indicator.classList.add('bg-gray-700');
            indicator.textContent = stepNumber;
        }
    });
    
    // Update connectors
    for (let i = 1; i < 4; i++) {
        const connector = document.getElementById(`stepConnector${i}`);
        if (connector) {
            if (i < currentStep) {
                connector.classList.remove('bg-gray-700');
                connector.classList.add('bg-green-600');
            } else {
                connector.classList.remove('bg-green-600');
                connector.classList.add('bg-gray-700');
            }
        }
    }
}

// Form validation helpers
export function validatePersonalInfo() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const university = document.getElementById('university').value.trim();
    
    if (!name) {
        showError('Please enter your full name');
        return false;
    }
    
    if (!email || !validateEmail(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    if (!phone || !validatePhone(phone)) {
        showError('Please enter a valid phone number');
        return false;
    }
    
    if (!university) {
        showError('Please enter your university/college name');
        return false;
    }
    
    return true;
}

// Email validation
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
export function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
}

// Transaction ID validation
export function validateTransactionId(transactionId) {
    return transactionId && transactionId.trim().length >= 4;
}

// Show error message
export function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.add('hidden');
        }, 5000);
    } else {
        // Fallback if error elements not found
        alert(message);
    }
}

// Testing function to verify DOM elements
export function testDomElements() {
    const elements = {
        'step1': !!document.getElementById('step1'),
        'step2': !!document.getElementById('step2'),
        'step3': !!document.getElementById('step3'),
        'step4': !!document.getElementById('step4'),
        'step1NextBtn': !!document.getElementById('step1NextBtn'),
        'step2NextBtn': !!document.getElementById('step2NextBtn'),
        'step2PrevBtn': !!document.getElementById('step2PrevBtn'),
        'step3NextBtn': !!document.getElementById('step3NextBtn'),
        'step3PrevBtn': !!document.getElementById('step3PrevBtn'),
        'step4PrevBtn': !!document.getElementById('step4PrevBtn'),
        'techCategoryBtn': !!document.getElementById('techCategoryBtn'),
        'culturalCategoryBtn': !!document.getElementById('culturalCategoryBtn'),
        'techEventsContainer': !!document.getElementById('techEventsContainer'),
        'culturalEventsContainer': !!document.getElementById('culturalEventsContainer')
    };
    
    console.table(elements);
    return elements;
}
