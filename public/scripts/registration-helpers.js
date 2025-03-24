/**
 * Helper functions for registration form validation and event handling
 */

// Validation functions
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Navigation helpers - improved for better debugging
export function goToStep(stepNumber, formSteps, stepIndicators) {
    console.log(`goToStep called: navigating to step ${stepNumber}`);
    
    // Check if the required elements are available
    if (!formSteps || !formSteps.length) {
        console.error('goToStep error: formSteps not provided or empty');
        return;
    }
    
    if (!stepIndicators || !stepIndicators.length) {
        console.error('goToStep error: stepIndicators not provided or empty');
        return;
    }
    
    // Hide all steps except the current one
    formSteps.forEach((step, index) => {
        if (index + 1 === stepNumber) {
            console.log(`Activating step ${index + 1}: ${step.id}`);
            step.classList.add('active');
            step.style.display = 'block'; // Explicitly set display
        } else {
            console.log(`Deactivating step ${index + 1}: ${step.id}`);
            step.classList.remove('active');
            step.style.display = 'none'; // Explicitly set display
        }
    });
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
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
    
    // Scroll to top of the form
    window.scrollTo({
        top: formSteps[0].offsetTop - 100,
        behavior: 'smooth'
    });
    
    console.log(`Navigation to step ${stepNumber} complete`);
}

// Error display helper - improved with timeout parameter
export function showError(message, errorMessage, errorAlert, timeout = 5000) {
    console.error(`Form error: ${message}`);
    if (errorMessage) errorMessage.textContent = message;
    if (errorAlert) errorAlert.classList.remove('hidden');
    
    // Scroll to error
    if (errorAlert) {
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Hide after specified timeout
    if (errorAlert && timeout > 0) {
        setTimeout(() => {
            errorAlert.classList.add('hidden');
        }, timeout);
    }
}

// Team events helper
export function getTeamEvents() {
    return [
        'pitch4sustain', 'ctrl-z', 'phantom-hunt', 
        'nritya-vedika', 'resonance', 'cosmic-drift', 
        'innovathon', 'drone-xtreme', 'model-blitz',
        'aether-frames'
    ];
}

// Get team sizes for events
export function getTeamSizes() {
    return {
        'pitch4sustain': 5,
        'ctrl-z': 4,
        'phantom-hunt': 5,
        'nritya-vedika': 15,
        'resonance': 6,
        'cosmic-drift': 10,
        'innovathon': 4,
        'drone-xtreme': 3,
        'model-blitz': 4,
        'aether-frames': 4
    };
}

// Team events detection
export function isTeamEvent(eventId) {
    return getTeamEvents().includes(eventId);
}

// Find max team size from selected events
export function findMaxTeamSize(selectedEvents) {
    let maxSize = 0;
    const teamSizes = getTeamSizes();
    
    for (const eventId of selectedEvents) {
        if (teamSizes[eventId] && teamSizes[eventId] > maxSize) {
            maxSize = teamSizes[eventId];
        }
    }
    
    return maxSize;
}

// Check if any team events are selected
export function hasTeamEvents(selectedEvents) {
    const teamEvents = getTeamEvents();
    
    for (const eventId of selectedEvents) {
        if (teamEvents.includes(eventId)) {
            return true;
        }
    }
    
    return false;
}

// Event initialization
export function initEventCards(eventCards, onSelectCallback) {
    eventCards.forEach(card => {
        // Add event selection checkbox if not already present
        if (!card.querySelector('.event-checkbox-input')) {
            const eventId = card.dataset.eventId;
            const titleElement = card.querySelector('.flex-1 > div:first-child');
            
            if (titleElement) {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'event-checkbox';
                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="event-${eventId}" class="sr-only event-checkbox-input" data-event-id="${eventId}">
                    <span class="w-5 h-5 border border-gray-500 rounded inline-block"></span>
                `;
                titleElement.appendChild(checkboxDiv);
            }
        }
        
        // Add click handler
        card.addEventListener('click', function(e) {
            // Prevent clicking on disabled cards
            if (card.classList.contains('disabled')) {
                return;
            }
            
            // Don't toggle if clicking the remove button
            if (e.target.closest('.remove-event-btn')) {
                return;
            }
            
            if (onSelectCallback) {
                onSelectCallback(card);
            }
        });
    });
}

/**
 * Directly navigate to a form step with reliability
 * @param {number} stepNumber - Step to navigate to
 * @param {NodeList} formSteps - All form step elements
 * @param {NodeList} stepIndicators - Step indicator elements
 */
export function directNavigate(stepNumber, formSteps, stepIndicators) {
    console.log(`Direct navigation to step ${stepNumber}`);
    
    // Hide all steps first
    formSteps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show target step
    const targetStep = formSteps[stepNumber - 1];
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'block';
    }
    
    // Update indicators
    stepIndicators.forEach((indicator, index) => {
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
}
