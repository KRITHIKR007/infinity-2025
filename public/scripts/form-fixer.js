/**
 * Direct form fixer script to address critical functionality issues
 * in the registration form
 */

// Run this script immediately when loaded
(function() {
  console.log('🛠️ Form Fixer loaded - applying emergency fixes');
  
  // Apply fixes when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFixes);
  } else {
    // DOM already loaded, apply fixes immediately
    applyFixes();
  }
  
  // Additional safety - apply fixes after a slight delay to ensure all other scripts have run
  setTimeout(applyFixes, 500);
  
  function applyFixes() {
    try {
      console.log('🔧 Applying form navigation fixes...');
      fixNavigation();
      
      console.log('🔧 Applying event selection fixes...');
      fixEventSelection();
      
      console.log('🔧 Applying payment section fixes...');
      fixPaymentSection();
      
      console.log('✅ All fixes applied successfully');
    } catch(err) {
      console.error('❌ Error applying fixes:', err);
    }
  }
  
  // Fix navigation buttons
  function fixNavigation() {
    // Fix form navigation between steps
    const navButtons = document.querySelectorAll('[data-nav-btn]');
    navButtons.forEach(btn => {
      // Ensure all buttons have click handlers
      if (!btn.onclick) {
        const targetStep = btn.dataset.target;
        btn.addEventListener('click', () => {
          navigateToStep(targetStep);
        });
      }
    });
    
    // Direct button selectors with multiple fallbacks
    const step1NextBtn = document.getElementById('step1NextBtn') || document.querySelector('.form-step#step1 button[type="button"]');
    const step2NextBtn = document.getElementById('step2NextBtn') || document.querySelector('.form-step#step2 button[type="button"]:last-child');
    const step3NextBtn = document.getElementById('step3NextBtn') || document.querySelector('.form-step#step3 button[type="button"]:last-child');
    
    if (step1NextBtn) {
      console.log("📋 Fixing Step 1 Next button");
      // Remove existing listeners by cloning and replacing
      const newBtn = step1NextBtn.cloneNode(true);
      step1NextBtn.parentNode.replaceChild(newBtn, step1NextBtn);
      
      // Add direct event handler
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("👆 Step 1 Next button clicked");
        directGoToStep(2);
      });
    }
    
    if (step2NextBtn) {
      console.log("📋 Fixing Step 2 Next button");
      const newBtn = step2NextBtn.cloneNode(true);
      step2NextBtn.parentNode.replaceChild(newBtn, step2NextBtn);
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("👆 Step 2 Next button clicked");
        directGoToStep(3);
      });
    }
    
    if (step3NextBtn) {
      console.log("📋 Fixing Step 3 Next button");
      const newBtn = step3NextBtn.cloneNode(true);
      step3NextBtn.parentNode.replaceChild(newBtn, step3NextBtn);
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("👆 Step 3 Next button clicked");
        directGoToStep(4);
      });
    }
  }
  
  // Fix event selection issues
  function fixEventSelection() {
    // Direct selection of all event cards and checkboxes
    const eventCards = document.querySelectorAll('.event-card');
    const eventCheckboxes = document.querySelectorAll('.event-checkbox-input');
    
    // Global variables to track state
    let selectedCategory = 'tech'; // Default category
    let selectedEvents = new Set();
    let totalFee = 0;
    
    // Fix event card click handling
    eventCards.forEach(card => {
      // Remove any existing click handlers by cloning and replacing
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      // Add new direct click handler
      newCard.addEventListener('click', function(e) {
        // Don't handle click if card is disabled
        if (newCard.classList.contains('disabled')) {
          console.log("Card is disabled, ignoring click");
          return;
        }
        
        console.log("Card clicked:", newCard.dataset.eventId);
        
        // Find the checkbox within this card
        const checkbox = newCard.querySelector('.event-checkbox-input');
        if (checkbox) {
          // Toggle checkbox state
          checkbox.checked = !checkbox.checked;
          console.log("Checkbox toggled:", checkbox.checked);
          
          // Update visual appearance
          if (checkbox.checked) {
            newCard.classList.add('selected');
            newCard.querySelector('.event-checkbox span').classList.add('bg-purple-600');
            newCard.querySelector('.event-checkbox span').classList.remove('border-gray-500');
            
            // Add to selected events and update fee
            selectedEvents.add(newCard.dataset.eventId);
            totalFee += parseInt(newCard.dataset.fee || 0, 10);
          } else {
            newCard.classList.remove('selected');
            newCard.querySelector('.event-checkbox span').classList.remove('bg-purple-600');
            newCard.querySelector('.event-checkbox span').classList.add('border-gray-500');
            
            // Remove from selected events and update fee
            selectedEvents.delete(newCard.dataset.eventId);
            totalFee -= parseInt(newCard.dataset.fee || 0, 10);
          }
          
          // Update total amount display
          updateTotalAmount();
          
          // Update selected events list
          updateSelectedEventsList();
        }
      });
      
      // Also handle the checkbox directly to ensure it works
      const checkbox = newCard.querySelector('.event-checkbox-input');
      if (checkbox) {
        checkbox.addEventListener('change', function(e) {
          // Stop propagation to prevent double-triggering with card click
          e.stopPropagation();
          
          console.log("Checkbox changed directly:", this.checked);
          
          // Update card appearance
          if (this.checked) {
            newCard.classList.add('selected');
            newCard.querySelector('.event-checkbox span').classList.add('bg-purple-600');
            newCard.querySelector('.event-checkbox span').classList.remove('border-gray-500');
            
            // Add to selected events and update fee
            selectedEvents.add(newCard.dataset.eventId);
            totalFee += parseInt(newCard.dataset.fee || 0, 10);
          } else {
            newCard.classList.remove('selected');
            newCard.querySelector('.event-checkbox span').classList.remove('bg-purple-600');
            newCard.querySelector('.event-checkbox span').classList.add('border-gray-500');
            
            // Remove from selected events and update fee
            selectedEvents.delete(newCard.dataset.eventId);
            totalFee -= parseInt(newCard.dataset.fee || 0, 10);
          }
          
          // Update total amount display
          updateTotalAmount();
          
          // Update selected events list
          updateSelectedEventsList();
        });
      }
    });
    
    // Fix category selection buttons
    const techCategoryBtn = document.getElementById('techCategoryBtn');
    const culturalCategoryBtn = document.getElementById('culturalCategoryBtn');
    const techEventsContainer = document.getElementById('techEventsContainer');
    const culturalEventsContainer = document.getElementById('culturalEventsContainer');
    
    if (techCategoryBtn) {
      techCategoryBtn.addEventListener('click', function() {
        console.log("Tech category selected");
        selectedCategory = 'tech';
        
        // Update UI
        techCategoryBtn.classList.add('bg-purple-600', 'text-white');
        techCategoryBtn.classList.remove('bg-gray-800', 'text-gray-300');
        culturalCategoryBtn.classList.add('bg-gray-800', 'text-gray-300');
        culturalCategoryBtn.classList.remove('bg-purple-600', 'text-white');
        
        // Show tech events, hide cultural events
        techEventsContainer.classList.remove('hidden');
        culturalEventsContainer.classList.add('hidden');
        
        // Show tech QR code in step 4
        const techQrCode = document.getElementById('techQrCode');
        const culturalQrCode = document.getElementById('culturalQrCode');
        if (techQrCode && culturalQrCode) {
          techQrCode.classList.remove('hidden');
          culturalQrCode.classList.add('hidden');
        }
      });
    }
    
    if (culturalCategoryBtn) {
      culturalCategoryBtn.addEventListener('click', function() {
        console.log("Cultural category selected");
        selectedCategory = 'cultural';
        
        // Update UI
        culturalCategoryBtn.classList.add('bg-purple-600', 'text-white');
        culturalCategoryBtn.classList.remove('bg-gray-800', 'text-gray-300');
        techCategoryBtn.classList.add('bg-gray-800', 'text-gray-300');
        techCategoryBtn.classList.remove('bg-purple-600', 'text-white');
        
        // Show cultural events, hide tech events
        culturalEventsContainer.classList.remove('hidden');
        techEventsContainer.classList.add('hidden');
        
        // Show cultural QR code in step 4
        const techQrCode = document.getElementById('techQrCode');
        const culturalQrCode = document.getElementById('culturalQrCode');
        if (techQrCode && culturalQrCode) {
          techQrCode.classList.add('hidden');
          culturalQrCode.classList.remove('hidden');
        }
      });
    }
  }
  
  // Fix payment section
  function fixPaymentSection() {
    // Hide payment proof upload elements if they exist
    const paymentProofUpload = document.getElementById('paymentProof');
    const previewContainer = document.getElementById('previewContainer');
    
    if (paymentProofUpload) {
      // Make sure the file upload works correctly
      paymentProofUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size exceeds the maximum limit of 5MB');
            this.value = '';
            if (previewContainer) previewContainer.classList.add('hidden');
            return;
          }
          
          // Preview the image
          if (previewContainer) {
            const previewImage = document.getElementById('previewImage');
            if (previewImage) {
              const reader = new FileReader();
              reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.classList.remove('hidden');
              };
              reader.readAsDataURL(file);
            }
          }
        }
      });
    }
    
    // Fix payment method selection
    const upiPayment = document.getElementById('upiPayment');
    const manualPayment = document.getElementById('manualPayment');
    const transactionIdField = document.getElementById('transactionId');
    const manualTransactionIdField = document.getElementById('manualTransactionId');
    
    if (upiPayment && transactionIdField) {
      upiPayment.addEventListener('change', function() {
        const qrCodes = document.getElementById('techQrCode')?.parentElement;
        if (qrCodes) qrCodes.style.opacity = '1';
        if (transactionIdField) transactionIdField.required = true;
        if (manualTransactionIdField) manualTransactionIdField.required = false;
      });
    }
    
    if (manualPayment && manualTransactionIdField) {
      manualPayment.addEventListener('change', function() {
        const qrCodes = document.getElementById('techQrCode')?.parentElement;
        if (qrCodes) qrCodes.style.opacity = '0.5';
        if (manualTransactionIdField) manualTransactionIdField.required = true;
        if (transactionIdField) transactionIdField.required = false;
      });
    }
  }
  
  // Helper function to update total amount display
  function updateTotalAmount() {
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
      totalAmount.textContent = `₹${window.totalFee || 0}`;
      console.log("Total fee updated:", window.totalFee);
      
      // Also update payment amount displays
      const techPaymentAmount = document.getElementById('techPaymentAmount');
      const culturalPaymentAmount = document.getElementById('culturalPaymentAmount');
      if (techPaymentAmount) techPaymentAmount.textContent = window.totalFee || 0;
      if (culturalPaymentAmount) culturalPaymentAmount.textContent = window.totalFee || 0;
    }
  }
  
  // Helper function to update selected events list
  function updateSelectedEventsList() {
    const selectedEventsList = document.getElementById('selectedEventsList');
    if (!selectedEventsList) return;
    
    const selectedEvents = document.querySelectorAll('.event-checkbox-input:checked');
    
    if (selectedEvents.length === 0) {
      selectedEventsList.innerHTML = '<p class="text-gray-400">No events selected</p>';
      return;
    }
    
    let eventsHtml = '';
    
    selectedEvents.forEach(checkbox => {
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
  
  // Direct step navigation function using pure DOM manipulation
  function directGoToStep(stepNumber) {
    console.log(`🔄 Directly navigating to step ${stepNumber}`);
    
    try {
      // Hide all steps
      document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
      });
      
      // Show target step
      const targetStep = document.getElementById(`step${stepNumber}`);
      if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
        console.log(`✅ Step ${stepNumber} is now displayed`);
      } else {
        console.error(`❌ Could not find step${stepNumber} element`);
      }
      
      // Update step indicators
      document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index + 1 === stepNumber) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else if (index + 1 < stepNumber) {
          indicator.classList.add('completed');
          indicator.classList.remove('active');
        } else {
          indicator.classList.remove('active', 'completed');
        }
      });
    } catch (err) {
      console.error("❌ Navigation error:", err);
      alert("Navigation error occurred. Please try refreshing the page.");
    }
  }
  
  // Make navigate function globally available
  window.directGoToStep = directGoToStep;
  
  // Make updateTotalAmount function globally available
  window.updateTotalAmount = updateTotalAmount;
  
  // Make updateSelectedEventsList function globally available
  window.updateSelectedEventsList = updateSelectedEventsList;
})();
