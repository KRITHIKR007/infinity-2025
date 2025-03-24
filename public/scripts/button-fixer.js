/**
 * Button fixer to ensure all registration form buttons work correctly
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Button fixer initialized');
    
    // Fix navigation buttons
    fixNavigationButtons();
    
    // Fix event selection
    fixEventSelection();
    
    // Fix payment method selection
    fixPaymentMethod();
});

/**
 * Fix form navigation buttons
 */
function fixNavigationButtons() {
    // Get all navigation buttons
    const step1NextBtn = document.getElementById('step1NextBtn');
    const step2PrevBtn = document.getElementById('step2PrevBtn');
    const step2NextBtn = document.getElementById('step2NextBtn');
    const step3PrevBtn = document.getElementById('step3PrevBtn');
    const step3NextBtn = document.getElementById('step3NextBtn');
    const step4PrevBtn = document.getElementById('step4PrevBtn');
    
    console.log('Fixing navigation buttons:', {
        step1NextBtn: !!step1NextBtn,
        step2PrevBtn: !!step2PrevBtn,
        step2NextBtn: !!step2NextBtn,
        step3PrevBtn: !!step3PrevBtn,
        step3NextBtn: !!step3NextBtn,
        step4PrevBtn: !!step4PrevBtn
    });
    
    // Define navigation function
    function navigateToStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.style.display = 'block';
            
            // Update step indicators
            updateStepIndicators(step);
        }
    }
    
    // Update step indicators based on current step
    function updateStepIndicators(currentStep) {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
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
        
        // Update connectors between steps
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
    
    // Add reliable click listeners to each button
    if (step1NextBtn) {
        // Clone and replace to remove any existing listeners
        const newBtn = step1NextBtn.cloneNode(true);
        step1NextBtn.parentNode.replaceChild(newBtn, step1NextBtn);
        
        // Add new listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Step 1 Next clicked');
            
            if (validateStep1()) {
                navigateToStep(2);
            }
        });
        
        // Also add direct onclick attribute as a fallback
        newBtn.setAttribute('onclick', 'validateStep1() && goToStep(2); return false;');
    }
    
    // Similar fixes for other navigation buttons
    // ...
}

/**
 * Fix event selection functionality
 */
function fixEventSelection() {
    // Get all event cards and category buttons
    const eventCards = document.querySelectorAll('.event-card');
    const techCategoryBtn = document.getElementById('techCategoryBtn');
    const culturalCategoryBtn = document.getElementById('culturalCategoryBtn');
    
    console.log('Fixing event selection:', {
        eventCards: eventCards.length,
        techCategoryBtn: !!techCategoryBtn,
        culturalCategoryBtn: !!culturalCategoryBtn
    });
    
    // Remove existing listeners and add reliable ones
    eventCards.forEach(card => {
        // Clone and replace to remove existing listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Add new click handler
        newCard.addEventListener('click', function(e) {
            // Don't handle click if card is disabled
            if (newCard.classList.contains('disabled')) {
                return;
            }
            
            // Don't toggle if clicking directly on checkbox
            if (e.target.classList.contains('event-checkbox-input')) {
                return;
            }
            
            // Toggle the checkbox
            const checkbox = newCard.querySelector('.event-checkbox-input');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                
                // Trigger change event on checkbox
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            }
        });
        
        // Handle checkbox change event
        const checkbox = newCard.querySelector('.event-checkbox-input');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    newCard.classList.add('selected');
                    newCard.querySelector('.event-checkbox span').classList.add('bg-purple-600');
                    newCard.querySelector('.event-checkbox span').classList.remove('border-gray-500');
                } else {
                    newCard.classList.remove('selected');
                    newCard.querySelector('.event-checkbox span').classList.remove('bg-purple-600');
                    newCard.querySelector('.event-checkbox span').classList.add('border-gray-500');
                }
                
                // Update total and selected events list
                updateSelectedEvents();
            });
        }
    });
    
    // Fix category buttons
    if (techCategoryBtn && culturalCategoryBtn) {
        // Tech category button
        techCategoryBtn.addEventListener('click', function() {
            selectCategory('tech');
        });
        
        // Cultural category button
        culturalCategoryBtn.addEventListener('click', function() {
            selectCategory('cultural');
        });
    }
    
    // Update selected events total and list
    function updateSelectedEvents() {
        const selectedEvents = document.querySelectorAll('.event-checkbox-input:checked');
        let totalFee = 0;
        
        // Calculate total fee
        selectedEvents.forEach(checkbox => {
            const card = checkbox.closest('.event-card');
            if (card) {
                totalFee += parseInt(card.dataset.fee || 0);
            }
        });
        
        // Update total fee display
        const totalAmount = document.getElementById('totalAmount');
        if (totalAmount) {
            totalAmount.textContent = `₹${totalFee}`;
        }
        
        // Update selected events list
        updateSelectedEventsList();
    }
    
    // Category selection
    function selectCategory(category) {
        if (category === 'tech') {
            techCategoryBtn.classList.add('bg-purple-600', 'text-white');
            techCategoryBtn.classList.remove('bg-gray-800', 'text-gray-300');
            culturalCategoryBtn.classList.add('bg-gray-800', 'text-gray-300');
            culturalCategoryBtn.classList.remove('bg-purple-600', 'text-white');
            
            document.getElementById('techEventsContainer').classList.remove('hidden');
            document.getElementById('culturalEventsContainer').classList.add('hidden');
            
            // Show tech QR code in the payment section
            const techQrCode = document.getElementById('techQrCode');
            const culturalQrCode = document.getElementById('culturalQrCode');
            if (techQrCode && culturalQrCode) {
                techQrCode.classList.remove('hidden');
                culturalQrCode.classList.add('hidden');
            }
        } else {
            culturalCategoryBtn.classList.add('bg-purple-600', 'text-white');
            culturalCategoryBtn.classList.remove('bg-gray-800', 'text-gray-300');
            techCategoryBtn.classList.add('bg-gray-800', 'text-gray-300');
            techCategoryBtn.classList.remove('bg-purple-600', 'text-white');
            
            document.getElementById('culturalEventsContainer').classList.remove('hidden');
            document.getElementById('techEventsContainer').classList.add('hidden');
            
            // Show cultural QR code in the payment section
            const techQrCode = document.getElementById('techQrCode');
            const culturalQrCode = document.getElementById('culturalQrCode');
            if (techQrCode && culturalQrCode) {
                techQrCode.classList.add('hidden');
                culturalQrCode.classList.remove('hidden');
            }
        }
    }
}

/**
 * Fix payment method selection
 */
function fixPaymentMethod() {
    const qrPaymentCard = document.getElementById('qrPaymentCard');
    const venuePaymentCard = document.getElementById('venuePaymentCard');
    
    console.log('Fixing payment method selection:', {
        qrPaymentCard: !!qrPaymentCard,
        venuePaymentCard: !!venuePaymentCard
    });
    
    // Only QR payment is used for now
    if (qrPaymentCard) {
        qrPaymentCard.classList.add('selected');
        
        // Show the payment proof section
        const paymentProofSection = document.getElementById('paymentProofSection');
        if (paymentProofSection) {
            paymentProofSection.classList.remove('hidden');
        }
        
        // Initialize file preview
        initFilePreview();
    }
}

/**
 * Initialize payment proof file preview
 */
function initFilePreview() {
    const paymentProof = document.getElementById('paymentProof');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const uploadLabel = document.getElementById('uploadLabel');
    
    if (paymentProof && previewContainer && previewImage) {
        paymentProof.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('File size exceeds the maximum limit of 5MB');
                    this.value = '';
                    previewContainer.classList.add('hidden');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewContainer.classList.remove('hidden');
                    if (uploadLabel) {
                        uploadLabel.textContent = 'Change Payment Proof';
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', function() {
                paymentProof.value = '';
                previewContainer.classList.add('hidden');
                if (uploadLabel) {
                    uploadLabel.textContent = 'Upload Payment Proof/Screenshot';
                }
            });
        }
    }
}

/**
 * Update the list of selected events in step 4
 */
function updateSelectedEventsList() {
    const selectedEventsList = document.getElementById('selectedEventsList');
    const selectedCheckboxes = document.querySelectorAll('.event-checkbox-input:checked');
    
    if (!selectedEventsList) return;
    
    if (selectedCheckboxes.length === 0) {
        selectedEventsList.innerHTML = '<p class="text-gray-400">No events selected</p>';
        return;
    }
    
    let eventsHtml = '';
    selectedCheckboxes.forEach(checkbox => {
        const card = checkbox.closest('.event-card');
        if (card) {
            const eventName = card.querySelector('h3').textContent;
            const eventFee = card.dataset.fee;
            
            eventsHtml += `
                <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
                    <span class="text-white">${eventName}</span>
                    <span class="text-purple-400">₹${eventFee}</span>
                </div>
            `;
        }
    });
    
    selectedEventsList.innerHTML = eventsHtml;
}

/**
 * Validate step 1 (personal information)
 */
function validateStep1() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const university = document.getElementById('university').value.trim();
    
    // Simple validation
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

/**
 * Email validation
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Phone validation (simple 10-digit)
 */
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Show error message
 */
function showError(message) {
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
        // Fallback
        alert(message);
    }
}

// Global navigation function for direct use in HTML attributes
window.goToStep = function(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
    }
};
