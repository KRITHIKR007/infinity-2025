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
    // Hard-coded button fixes with maximum reliability
    const buttons = {
      step1Next: document.getElementById('step1NextBtn'),
      step2Prev: document.getElementById('step2PrevBtn'),
      step2Next: document.getElementById('step2NextBtn'),
      step3Prev: document.getElementById('step3PrevBtn'),
      step3Next: document.getElementById('step3NextBtn'),
      step4Prev: document.getElementById('step4PrevBtn')
    };
    
    // Log which buttons were found
    console.log('Found buttons:', Object.fromEntries(
      Object.entries(buttons).map(([key, val]) => [key, !!val])
    ));
    
    // Clone and replace button 1 with forced handling
    if (buttons.step1Next) {
      const newBtn = buttons.step1Next.cloneNode(true);
      buttons.step1Next.parentNode.replaceChild(newBtn, buttons.step1Next);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 1 Next clicked - direct handler');
        forceNavigateToStep(2);
      });
    }
    
    // Step 2 prev button
    if (buttons.step2Prev) {
      const newBtn = buttons.step2Prev.cloneNode(true);
      buttons.step2Prev.parentNode.replaceChild(newBtn, buttons.step2Prev);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 2 Prev clicked - direct handler');
        forceNavigateToStep(1);
      });
    }
    
    // Step 2 next button
    if (buttons.step2Next) {
      const newBtn = buttons.step2Next.cloneNode(true);
      buttons.step2Next.parentNode.replaceChild(newBtn, buttons.step2Next);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 2 Next clicked - direct handler');
        
        const selectedEvents = document.querySelectorAll('.event-checkbox-input:checked');
        if (selectedEvents.length === 0) {
          showFormError('Please select at least one event');
          return;
        }
        
        forceNavigateToStep(3);
      });
    }
    
    // Step 3 prev button
    if (buttons.step3Prev) {
      const newBtn = buttons.step3Prev.cloneNode(true);
      buttons.step3Prev.parentNode.replaceChild(newBtn, buttons.step3Prev);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 3 Prev clicked - direct handler');
        forceNavigateToStep(2);
      });
    }
    
    // Step 3 next button
    if (buttons.step3Next) {
      const newBtn = buttons.step3Next.cloneNode(true);
      buttons.step3Next.parentNode.replaceChild(newBtn, buttons.step3Next);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 3 Next clicked - direct handler');
        forceNavigateToStep(4);
        
        // Update payment amount too
        updatePaymentAmounts();
      });
    }
    
    // Step 4 prev button
    if (buttons.step4Prev) {
      const newBtn = buttons.step4Prev.cloneNode(true);
      buttons.step4Prev.parentNode.replaceChild(newBtn, buttons.step4Prev);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Step 4 Prev clicked - direct handler');
        forceNavigateToStep(3);
      });
    }
  }
  
  // Fix event selection issues
  function fixEventSelection() {
    // Set up category switchers
    const techBtn = document.getElementById('techCategoryBtn');
    const culturalBtn = document.getElementById('culturalCategoryBtn');
    
    if (techBtn && culturalBtn) {
      // Clear and re-add tech category button click handler
      const newTechBtn = techBtn.cloneNode(true);
      techBtn.parentNode.replaceChild(newTechBtn, techBtn);
      
      newTechBtn.addEventListener('click', function() {
        console.log('🔘 Tech category selected');
        setActiveCategory('tech');
      });
      
      // Clear and re-add cultural category button click handler
      const newCulturalBtn = culturalBtn.cloneNode(true);
      culturalBtn.parentNode.replaceChild(newCulturalBtn, culturalBtn);
      
      newCulturalBtn.addEventListener('click', function() {
        console.log('🔘 Cultural category selected');
        setActiveCategory('cultural');
      });
      
      // Ensure tech is selected by default
      setActiveCategory('tech');
    }
    
    // Fix all event cards
    const eventCards = document.querySelectorAll('.event-card');
    console.log(`Found ${eventCards.length} event cards to fix`);
    
    eventCards.forEach((card, index) => {
      // Clone and replace to remove any existing handlers
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      // Add direct click handler to the card
      newCard.addEventListener('click', function(e) {
        // Don't continue if clicking on disabled card
        if (newCard.classList.contains('disabled')) {
          return;
        }
        
        // If clicking directly on the checkbox, let it handle normally
        if (e.target.closest('.event-checkbox-input')) {
          return;
        }
        
        // Otherwise toggle the checkbox state
        const checkbox = newCard.querySelector('.event-checkbox-input');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          
          // Update card visually
          if (checkbox.checked) {
            newCard.classList.add('selected');
            const checkSpan = newCard.querySelector('.event-checkbox span');
            if (checkSpan) {
              checkSpan.classList.add('bg-purple-600');
              checkSpan.classList.remove('border-gray-500');
            }
          } else {
            newCard.classList.remove('selected');
            const checkSpan = newCard.querySelector('.event-checkbox span');
            if (checkSpan) {
              checkSpan.classList.remove('bg-purple-600');
              checkSpan.classList.add('border-gray-500');
            }
          }
          
          // Update event list and total
          updateEventSelections();
        }
      });
      
      // Also fix the checkbox directly
      const checkbox = newCard.querySelector('.event-checkbox-input');
      if (checkbox) {
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            newCard.classList.add('selected');
            const checkSpan = newCard.querySelector('.event-checkbox span');
            if (checkSpan) {
              checkSpan.classList.add('bg-purple-600');
              checkSpan.classList.remove('border-gray-500');
            }
          } else {
            newCard.classList.remove('selected');
            const checkSpan = newCard.querySelector('.event-checkbox span');
            if (checkSpan) {
              checkSpan.classList.remove('bg-purple-600');
              checkSpan.classList.add('border-gray-500');
            }
          }
          
          // Update event list and total
          updateEventSelections();
        });
      }
    });
  }
  
  // Fix payment section
  function fixPaymentSection() {
    // Ensure the payment QR codes are visible
    const techQrCode = document.getElementById('techQrCode');
    const culturalQrCode = document.getElementById('culturalQrCode');
    
    if (techQrCode && culturalQrCode) {
      // Default to tech events QR code
      techQrCode.classList.remove('hidden');
      culturalQrCode.classList.add('hidden');
    }
    
    // Fix payment proof image upload
    const paymentProof = document.getElementById('paymentProof');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const uploadLabel = document.getElementById('uploadLabel');
    
    if (paymentProof && previewContainer && previewImage) {
      paymentProof.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          
          // Check file size
          if (file.size > 5 * 1024 * 1024) {
            showFormError('File size exceeds the maximum limit of 5MB');
            this.value = '';
            previewContainer.classList.add('hidden');
            return;
          }
          
          // Preview the image
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
      
      // Handle remove button
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
    
    // Fix the payment amount display
    updatePaymentAmounts();
  }
  
  // Helper function to forcefully navigate between steps
  function forceNavigateToStep(step) {
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
      console.log(`✅ Successfully navigated to step ${step}`);
      
      // Update step indicators
      updateStepIndicators(step);
    } else {
      console.error(`❌ Could not find step${step} element`);
    }
  }
  
  // Helper function to set active category
  function setActiveCategory(category) {
    const techBtn = document.getElementById('techCategoryBtn');
    const culturalBtn = document.getElementById('culturalCategoryBtn');
    const techContainer = document.getElementById('techEventsContainer');
    const culturalContainer = document.getElementById('culturalEventsContainer');
    const techQrCode = document.getElementById('techQrCode');
    const culturalQrCode = document.getElementById('culturalQrCode');
    
    if (category === 'tech') {
      // Update buttons
      techBtn.classList.add('bg-purple-600', 'text-white');
      techBtn.classList.remove('bg-gray-800', 'text-gray-300');
      culturalBtn.classList.add('bg-gray-800', 'text-gray-300');
      culturalBtn.classList.remove('bg-purple-600', 'text-white');
      
      // Update containers
      techContainer.classList.remove('hidden');
      culturalContainer.classList.add('hidden');
      
      // Update QR codes
      if (techQrCode && culturalQrCode) {
        techQrCode.classList.remove('hidden');
        culturalQrCode.classList.add('hidden');
      }
    } else {
      // Update buttons
      culturalBtn.classList.add('bg-purple-600', 'text-white');
      culturalBtn.classList.remove('bg-gray-800', 'text-gray-300');
      techBtn.classList.add('bg-gray-800', 'text-gray-300');
      techBtn.classList.remove('bg-purple-600', 'text-white');
      
      // Update containers
      culturalContainer.classList.remove('hidden');
      techContainer.classList.add('hidden');
      
      // Update QR codes
      if (techQrCode && culturalQrCode) {
        techQrCode.classList.add('hidden');
        culturalQrCode.classList.remove('hidden');
      }
    }
  }
  
  // Helper function to update step indicators
  function updateStepIndicators(currentStep) {
    const indicators = document.querySelectorAll('.step-indicator');
    const connectors = [
      document.getElementById('stepConnector1'),
      document.getElementById('stepConnector2'),
      document.getElementById('stepConnector3')
    ];
    
    indicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      
      if (stepNum < currentStep) {
        // Completed steps
        indicator.classList.remove('bg-gray-700');
        indicator.classList.add('bg-green-600');
        indicator.innerHTML = '<i class="fas fa-check"></i>';
      } else if (stepNum === currentStep) {
        // Current step
        indicator.classList.remove('bg-gray-700', 'bg-green-600');
        indicator.classList.add('bg-purple-600');
        indicator.textContent = stepNum;
      } else {
        // Future steps
        indicator.classList.remove('bg-purple-600', 'bg-green-600');
        indicator.classList.add('bg-gray-700');
        indicator.textContent = stepNum;
      }
    });
    
    // Update connectors
    connectors.forEach((connector, index) => {
      if (!connector) return;
      
      if (index + 1 < currentStep) {
        connector.classList.remove('bg-gray-700');
        connector.classList.add('bg-green-600');
      } else {
        connector.classList.remove('bg-green-600');
        connector.classList.add('bg-gray-700');
      }
    });
  }
  
  // Helper function to update event selections in the UI
  function updateEventSelections() {
    const selectedEvents = document.querySelectorAll('.event-checkbox-input:checked');
    let totalFee = 0;
    
    // Calculate total fee
    selectedEvents.forEach(checkbox => {
      const card = checkbox.closest('.event-card');
      if (card) {
        const fee = parseInt(card.dataset.fee || '0', 10);
        totalFee += fee;
      }
    });
    
    // Update total amount
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
      totalAmount.textContent = `₹${totalFee}`;
    }
    
    // Update selected events list
    const selectedEventsList = document.getElementById('selectedEventsList');
    if (selectedEventsList) {
      if (selectedEvents.length === 0) {
        selectedEventsList.innerHTML = '<p class="text-gray-400">No events selected</p>';
      } else {
        let eventsHtml = '';
        
        selectedEvents.forEach(checkbox => {
          const card = checkbox.closest('.event-card');
          if (card) {
            const name = card.querySelector('h3')?.textContent || 'Unknown Event';
            const fee = card.dataset.fee || '0';
            
            eventsHtml += `
              <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
                <span class="text-white">${name}</span>
                <span class="text-purple-400">₹${fee}</span>
              </div>
            `;
          }
        });
        
        selectedEventsList.innerHTML = eventsHtml;
      }
    }
    
    // Update payment amounts
    updatePaymentAmounts();
  }
  
  // Helper function to update payment amounts
  function updatePaymentAmounts() {
    const totalAmount = document.getElementById('totalAmount');
    const techAmount = document.getElementById('techPaymentAmount');
    const culturalAmount = document.getElementById('culturalPaymentAmount');
    
    if (totalAmount && techAmount && culturalAmount) {
      const amount = totalAmount.textContent.replace('₹', '');
      techAmount.textContent = amount;
      culturalAmount.textContent = amount;
    }
  }
  
  // Helper function to show error
  function showFormError(message) {
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
      // Fallback to standard alert
      alert(message);
    }
  }
})();
