/**
 * DOM-Fixer: Utility to fix common DOM issues that can break form navigation
 */

/**
 * Fix the step navigation in the registration form
 * @returns {Object} - Status report of fixes
 */
export function fixRegistrationForm() {
    console.log("🛠️ DOM-Fixer: Running registration form fixes");
    const fixes = {
        styles: fixFormStyles(),
        eventListeners: fixEventListeners(),
        buttons: fixButtons(),
        steps: ensureStepsExist(),
        emergency: emergencyFixNextButtons()
    };
    
    console.log("🛠️ DOM-Fixer: Fixes applied", fixes);
    return fixes;
}

/**
 * Fix form styles that might be preventing proper display
 */
function fixFormStyles() {
    try {
        // Add inline styles to ensure form steps display properly
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Critical display fixes */
            .form-step {
                display: none !important;
            }
            .form-step.active {
                display: block !important;
            }
            
            /* Button fixes */
            .btn {
                pointer-events: auto !important;
                cursor: pointer !important;
                position: relative !important;
                z-index: 5 !important;
            }
        `;
        document.head.appendChild(styleEl);
        
        // Force direct style for current active step
        const activeStep = document.querySelector('.form-step.active');
        if (activeStep) {
            activeStep.style.display = 'block';
        }
        
        return { success: true };
    } catch (err) {
        console.error("Style fix error:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Fix event listeners on navigation buttons
 */
function fixEventListeners() {
    try {
        // Get all navigation buttons
        const navButtons = [
            'step1NextBtn', 'step2PrevBtn', 'step2NextBtn', 
            'step3PrevBtn', 'step3NextBtn', 'step4PrevBtn'
        ];
        
        // For each button, create a fallback click handler
        navButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                // Add direct onclick attribute as fallback
                const stepNum = buttonId.includes('Next') 
                    ? parseInt(buttonId.charAt(4)) + 1
                    : parseInt(buttonId.charAt(4)) - 1;
                
                button.setAttribute('onclick', `
                    try {
                        const steps = document.querySelectorAll('.form-step');
                        steps.forEach(s => {
                            s.classList.remove('active');
                            s.style.display = 'none';
                        });
                        const target = document.getElementById('step${stepNum}');
                        if (target) {
                            target.classList.add('active');
                            target.style.display = 'block';
                        }
                        return false;
                    } catch(e) {
                        console.error('Button click error:', e);
                    }
                `);
            }
        });
        
        return { success: true };
    } catch (err) {
        console.error("Event listener fix error:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Fix button elements that might be unclickable
 */
function fixButtons() {
    try {
        // Fix all buttons to ensure they're clickable
        const buttons = document.querySelectorAll('button');
        let fixedCount = 0;
        
        buttons.forEach(button => {
            // Make sure buttons have the right styling and properties
            button.style.cursor = 'pointer';
            button.style.pointerEvents = 'auto';
            button.style.position = 'relative';
            button.style.zIndex = '10';
            
            // Check if button has any event listeners
            const hasListeners = button.onclick || 
                button.getAttribute('onclick') || 
                window.getComputedStyle(button).cursor === 'pointer';
            
            // Add critical fix for Next buttons
            if (button.id && button.id.includes('NextBtn')) {
                // Enhanced next button fix with correct step navigation
                const stepNum = parseInt(button.id.charAt(4));
                if (!isNaN(stepNum)) {
                    // Set a direct onclick attribute that will work even if event listeners fail
                    button.setAttribute('onclick', `
                        console.log('Direct navigation from button ${button.id}');
                        try {
                            const targetStep = document.getElementById('step${stepNum+1}');
                            if (!targetStep) throw new Error('Target step not found');
                            
                            // Hide all steps first
                            document.querySelectorAll('.form-step').forEach(s => {
                                s.classList.remove('active');
                                s.style.display = 'none';
                            });
                            
                            // Show target step
                            targetStep.classList.add('active');
                            targetStep.style.display = 'block';
                            
                            // Update indicators
                            document.querySelectorAll('.step-indicator').forEach((ind, i) => {
                                if (i + 1 === ${stepNum+1}) ind.classList.add('active');
                                else if (i + 1 < ${stepNum+1}) ind.classList.add('completed');
                                else ind.classList.remove('active', 'completed');
                            });
                            return false;
                        } catch(e) {
                            console.error('Navigation error:', e);
                        }
                    `);
                    fixedCount++;
                }
            }
            
            if (!hasListeners) {
                // Add a debug click handler to non-functional buttons
                button.setAttribute('onclick', "console.log('Button clicked:', this.id || this.textContent);");
                fixedCount++;
            }
        });
        
        return { success: true, fixedCount };
    } catch (err) {
        console.error("Button fix error:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Make sure all required form steps exist
 */
function ensureStepsExist() {
    try {
        const stepsContainer = document.getElementById('registrationForm');
        if (!stepsContainer) return { success: false, error: 'Registration form not found' };
        
        const steps = ['step1', 'step2', 'step3', 'step4'];
        let missing = [];
        
        steps.forEach(stepId => {
            const step = document.getElementById(stepId);
            if (!step) {
                missing.push(stepId);
            }
        });
        
        return { success: missing.length === 0, missing };
    } catch (err) {
        console.error("Step check error:", err);
        return { success: false, error: err.message };
    }
}

// Add a special emergency fix for next buttons
function emergencyFixNextButtons() {
    console.log("🚑 Applying emergency fix for Next buttons");
    
    // Find all Next buttons by ID pattern
    const nextButtons = [
        document.getElementById('step1NextBtn'),
        document.getElementById('step2NextBtn'),
        document.getElementById('step3NextBtn')
    ].filter(btn => btn); // Remove nulls
    
    nextButtons.forEach(btn => {
        const stepNum = parseInt(btn.id.charAt(4));
        if (isNaN(stepNum)) return;
        
        // Force style to ensure visibility
        btn.style.backgroundColor = "#9333ea"; // Purple
        btn.style.color = "white";
        btn.style.cursor = "pointer";
        btn.style.border = "2px solid white";
        
        // Add multiple event handlers to ensure at least one works
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Emergency handler: Next button clicked for step ${stepNum}`);
            
            // Force display of next step
            const allSteps = document.querySelectorAll('.form-step');
            allSteps.forEach(step => {
                step.classList.remove('active');
                step.style.display = 'none';
            });
            
            const nextStep = document.getElementById(`step${stepNum+1}`);
            if (nextStep) {
                nextStep.classList.add('active');
                nextStep.style.display = 'block';
                console.log(`Successfully navigated to step ${stepNum+1}`);
            }
        });
        
        // Also add HTML onclick attribute as ultimate fallback
        btn.setAttribute('onclick', `
            console.log('HTML attribute handler clicked');
            document.querySelectorAll('.form-step').forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });
            const next = document.getElementById('step${stepNum+1}');
            if (next) {
                next.classList.add('active');
                next.style.display = 'block';
            }
            return false;
        `);
    });
    
    return { fixed: nextButtons.length };
}

// Auto-run fixer when script is loaded
if (typeof window !== 'undefined' && window.document) {
    window.addEventListener('DOMContentLoaded', () => {
        fixRegistrationForm();
        
        // Add a global helper
        window.fixRegistrationForm = fixRegistrationForm;
    });
}
