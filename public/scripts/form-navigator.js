/**
 * Create a form navigator for multi-step forms
 * @returns {Object} Form navigator with navigation functions
 */
export function createFormNavigator() {
    // Track current step
    let currentStep = 1;
    
    // Get step elements
    const getFormSteps = () => document.querySelectorAll('.form-step');
    const getStepIndicators = () => document.querySelectorAll('.step-indicator');
    
    /**
     * Navigate to a specific step
     * @param {number} step - Step number to navigate to
     */
    function goToStep(step) {
        const formSteps = getFormSteps();
        const stepIndicators = getStepIndicators();
        
        if (!formSteps.length || !stepIndicators.length) {
            console.error('Form steps or indicators not found');
            return;
        }
        
        // Hide all steps
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
            formStep.style.display = 'none';
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.style.display = 'block';
            
            // Update step indicators
            updateStepIndicators(step, stepIndicators);
            
            // Update current step
            currentStep = step;
            
            // Scroll to top of form
            window.scrollTo({
                top: formSteps[0].offsetTop - 100,
                behavior: 'smooth'
            });
        } else {
            console.error(`Step ${step} element not found`);
        }
    }
    
    /**
     * Update step indicators to reflect current step
     * @param {number} currentStep - Current step number
     * @param {NodeList} indicators - Step indicator elements
     */
    function updateStepIndicators(currentStep, indicators) {
        indicators.forEach((indicator, index) => {
            if (index + 1 === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (index + 1 < currentStep) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else {
                indicator.classList.remove('active', 'completed');
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
    
    /**
     * Go to next step
     */
    function next() {
        goToStep(currentStep + 1);
    }
    
    /**
     * Go to previous step
     */
    function prev() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    }
    
    /**
     * Get current step
     * @returns {number} Current step
     */
    function getCurrentStep() {
        return currentStep;
    }
    
    return {
        goToStep,
        next,
        prev,
        getCurrentStep
    };
}
