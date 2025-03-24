/**
 * Simple and reliable form step navigation
 */

export function createFormNavigator() {
    let currentStep = 1;
    
    // Navigate to specific step with enhanced reliability
    function goToStep(stepNumber, formSteps, stepIndicators) {
        console.log(`Form Navigator: Navigating to step ${stepNumber}`);
        
        if (!formSteps || !formSteps.length) {
            console.error("Form Navigator: formSteps is missing or empty");
            return;
        }
        
        if (!stepIndicators || !stepIndicators.length) {
            console.error("Form Navigator: stepIndicators is missing or empty");
            return;
        }
        
        // Force display updates with direct style manipulation for maximum reliability
        formSteps.forEach((step, index) => {
            try {
                if (index + 1 === stepNumber) {
                    step.classList.add('active');
                    step.style.display = 'block';
                    step.style.opacity = '1';
                    step.style.visibility = 'visible';
                } else {
                    step.classList.remove('active');
                    step.style.display = 'none';
                    step.style.opacity = '0';
                    step.style.visibility = 'hidden';
                }
            } catch (err) {
                console.error(`Form Navigator: Error setting display for step ${index + 1}:`, err);
            }
        });
        
        // Update indicators with try-catch for error resilience
        try {
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
        } catch (err) {
            console.error("Form Navigator: Error updating step indicators:", err);
        }
        
        currentStep = stepNumber;
        console.log(`Form Navigator: Current step is now ${currentStep}`);
        
        // Return status for debugging
        return {
            success: true,
            currentStep
        };
    }
    
    return {
        goToStep,
        getCurrentStep: () => currentStep,
        
        // Add a direct step controller for emergency navigation
        forceStep: (stepNumber) => {
            console.log(`Form Navigator: Force navigating to step ${stepNumber}`);
            
            try {
                // Direct DOM manipulation as fallback
                document.querySelectorAll('.form-step').forEach(step => {
                    if (step.id === `step${stepNumber}`) {
                        step.classList.add('active');
                        step.style.display = 'block';
                    } else {
                        step.classList.remove('active');
                        step.style.display = 'none';
                    }
                });
                
                document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
                    if (index + 1 === stepNumber) {
                        indicator.classList.add('active');
                    } else if (index + 1 < stepNumber) {
                        indicator.classList.add('completed');
                    } else {
                        indicator.classList.remove('active', 'completed');
                    }
                });
                
                currentStep = stepNumber;
                return true;
            } catch (err) {
                console.error("Form Navigator: Error in forceStep:", err);
                return false;
            }
        }
    };
}
