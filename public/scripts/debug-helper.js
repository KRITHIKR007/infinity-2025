/**
 * Debugging helpers for Infinity-2025 website
 * Include this script for troubleshooting frontend issues
 */

/**
 * Initialize debug tools for registration form
 */
export function initDebugTools() {
    console.log('🐞 Debug tools initialized');
    
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.className = 'fixed bottom-4 right-4 bg-gray-900 border border-purple-500 rounded-lg p-4 z-50 text-white text-sm';
    debugPanel.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">Debug Panel</h3>
            <button id="toggleDebugPanel" class="text-xs bg-gray-700 px-2 py-1 rounded">Minimize</button>
        </div>
        <div id="debugContent">
            <div class="mb-2">
                <div>Current Step: <span id="debugCurrentStep" class="text-purple-400">1</span></div>
                <div>Selected Events: <span id="debugSelectedEvents" class="text-purple-400">0</span></div>
            </div>
            <div class="flex flex-col space-y-2">
                <button id="debugForceStep1" class="text-xs bg-blue-800 px-2 py-1 rounded">Go to Step 1</button>
                <button id="debugForceStep2" class="text-xs bg-blue-800 px-2 py-1 rounded">Go to Step 2</button>
                <button id="debugForceStep3" class="text-xs bg-blue-800 px-2 py-1 rounded">Go to Step 3</button>
                <button id="debugForceStep4" class="text-xs bg-blue-800 px-2 py-1 rounded">Go to Step 4</button>
                <button id="debugCheck" class="text-xs bg-green-800 px-2 py-1 rounded">Check Form State</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Toggle debug panel visibility
    const toggleDebugPanel = document.getElementById('toggleDebugPanel');
    const debugContent = document.getElementById('debugContent');
    
    toggleDebugPanel.addEventListener('click', function() {
        if (debugContent.style.display === 'none') {
            debugContent.style.display = 'block';
            toggleDebugPanel.textContent = 'Minimize';
        } else {
            debugContent.style.display = 'none';
            toggleDebugPanel.textContent = 'Expand';
        }
    });
    
    // Force go to specific steps
    document.getElementById('debugForceStep1').addEventListener('click', () => forceGoToStep(1));
    document.getElementById('debugForceStep2').addEventListener('click', () => forceGoToStep(2));
    document.getElementById('debugForceStep3').addEventListener('click', () => forceGoToStep(3));
    document.getElementById('debugForceStep4').addEventListener('click', () => forceGoToStep(4));
    
    // Check form state
    document.getElementById('debugCheck').addEventListener('click', checkFormState);
    
    // Update debug panel with current state
    function updateDebugInfo() {
        const currentStep = getCurrentStep();
        const selectedEventsCount = getSelectedEventsCount();
        
        document.getElementById('debugCurrentStep').textContent = currentStep;
        document.getElementById('debugSelectedEvents').textContent = selectedEventsCount;
    }
    
    // Get current step based on active form-step
    function getCurrentStep() {
        const activeStep = document.querySelector('.form-step.active');
        if (!activeStep) return 'None';
        
        if (activeStep.id === 'step1') return '1';
        if (activeStep.id === 'step2') return '2';
        if (activeStep.id === 'step3') return '3';
        if (activeStep.id === 'step4') return '4';
        
        return 'Unknown';
    }
    
    // Get count of selected events
    function getSelectedEventsCount() {
        const selectedEvents = document.querySelectorAll('.event-card.selected');
        return selectedEvents.length;
    }
    
    // Force navigation to specific step
    function forceGoToStep(step) {
        console.log(`Debug: Force navigating to step ${step}`);
        
        const formSteps = document.querySelectorAll('.form-step');
        const stepIndicators = document.querySelectorAll('.step-indicator');
        
        // Hide all steps
        formSteps.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.style.display = 'block';
            console.log(`Debug: Step ${step} activated`);
        } else {
            console.error(`Debug: Step ${step} element not found`);
        }
        
        // Update indicators
        stepIndicators.forEach((indicator, index) => {
            if (index + 1 === step) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (index + 1 < step) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
        
        updateDebugInfo();
    }
    
    // Check and log form state
    function checkFormState() {
        console.group('Form State Check');
        
        // Check if all steps exist
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        const step4 = document.getElementById('step4');
        
        console.log('Step elements exist:', {
            step1: !!step1,
            step2: !!step2,
            step3: !!step3,
            step4: !!step4
        });
        
        // Check buttons
        const step1NextBtn = document.getElementById('step1NextBtn');
        const step2PrevBtn = document.getElementById('step2PrevBtn');
        const step2NextBtn = document.getElementById('step2NextBtn');
        const step3PrevBtn = document.getElementById('step3PrevBtn');
        const step3NextBtn = document.getElementById('step3NextBtn');
        const step4PrevBtn = document.getElementById('step4PrevBtn');
        
        console.log('Navigation buttons exist:', {
            step1NextBtn: !!step1NextBtn,
            step2PrevBtn: !!step2PrevBtn,
            step2NextBtn: !!step2NextBtn,
            step3PrevBtn: !!step3PrevBtn,
            step3NextBtn: !!step3NextBtn,
            step4PrevBtn: !!step4PrevBtn
        });
        
        // Check for CSS conflicts
        if (step1 && step2 && step3 && step4) {
            console.log('CSS display values:', {
                step1: getComputedStyle(step1).display,
                step2: getComputedStyle(step2).display,
                step3: getComputedStyle(step3).display,
                step4: getComputedStyle(step4).display
            });
        }
        
        // Log current form data
        const name = document.getElementById('name')?.value || 'Not found';
        const email = document.getElementById('email')?.value || 'Not found';
        const phone = document.getElementById('phone')?.value || 'Not found';
        
        console.log('Form data:', { name, email, phone });
        
        console.groupEnd();
        
        alert('Form state checked - see console for details (F12)');
    }
    
    // Initialize state
    updateDebugInfo();
    
    // Update debug info every 2 seconds
    setInterval(updateDebugInfo, 2000);
    
    return {
        forceGoToStep,
        checkFormState,
        updateDebugInfo
    };
}

// Register debug helpers globally
if (typeof window !== 'undefined') {
    window.initRegistrationDebug = initDebugTools;
}

/**
 * Debug helper utility for troubleshooting loading issues
 */

// Check if scripts are loading properly
console.log('Debug helper loaded');

// Function to check Supabase connection
export async function checkSupabaseConnection() {
    try {
        const { createClient } = await import('@supabase/supabase-js');
        
        // Get Supabase credentials from the page (for testing only)
        const urlMeta = document.querySelector('meta[name="supabase-url"]');
        const keyMeta = document.querySelector('meta[name="supabase-anon-key"]');
        
        const url = urlMeta ? urlMeta.getAttribute('content') : 'https://ceickbodqhwfhcpabfdq.supabase.co';
        const key = keyMeta ? keyMeta.getAttribute('content') : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaWNrYm9kcWh3ZmhjcGFiZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzU2MTgsImV4cCI6MjA1NzkxMTYxOH0.ZyTG1FkQzjQ0CySlyvkQEYPHWBbZJd--vsB_IqILuo8';
        
        // Initialize test Supabase client
        const supabase = createClient(url, key);
        
        // Test a simple query
        const { data, error } = await supabase
            .from('events')
            .select('id')
            .limit(1);
            
        if (error) throw error;
        
        console.log('Supabase connection test successful');
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Supabase connection test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Add debug panel to the page
export function addDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.className = 'fixed bottom-4 right-4 bg-gray-900 p-4 rounded-lg shadow-lg z-50 text-white text-sm';
    debugPanel.innerHTML = `
        <h3 class="font-bold mb-2">Debug Panel</h3>
        <div id="debugInfo" class="space-y-2">
            <p>Loading debug information...</p>
        </div>
        <div class="mt-2 border-t border-gray-700 pt-2">
            <button id="testConnectionBtn" class="bg-purple-600 text-white px-2 py-1 rounded text-xs">Test Connection</button>
            <button id="forceReloadBtn" class="bg-red-600 text-white px-2 py-1 rounded text-xs ml-2">Force Reload</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(debugPanel);
    
    // Add event listeners to buttons
    document.getElementById('testConnectionBtn').addEventListener('click', async () => {
        const result = await checkSupabaseConnection();
        const debugInfo = document.getElementById('debugInfo');
        
        if (result.success) {
            debugInfo.innerHTML = `<p class="text-green-400">Connection successful!</p>`;
        } else {
            debugInfo.innerHTML = `<p class="text-red-400">Connection failed: ${result.error}</p>`;
        }
    });
    
    document.getElementById('forceReloadBtn').addEventListener('click', () => {
        window.location.reload(true); // Force reload from server
    });
    
    // Show some basic debug info
    collectDebugInfo();
}

// Collect debug information
async function collectDebugInfo() {
    const debugInfo = document.getElementById('debugInfo');
    if (!debugInfo) return;
    
    debugInfo.innerHTML = '';
    
    // Check if Supabase client is loaded
    try {
        const supabaseLoaded = typeof window.supabase !== 'undefined';
        addDebugLine(debugInfo, 'Supabase client', supabaseLoaded ? 'Loaded' : 'Not loaded', supabaseLoaded);
    } catch (e) {
        addDebugLine(debugInfo, 'Supabase client', 'Error checking: ' + e.message, false);
    }
    
    // Add browser info
    addDebugLine(debugInfo, 'Browser', navigator.userAgent);
    
    // Add network status
    addDebugLine(debugInfo, 'Network', navigator.onLine ? 'Online' : 'Offline', navigator.onLine);
    
    // Add script load status
    const scripts = Array.from(document.getElementsByTagName('script'));
    const mainScriptLoaded = scripts.some(s => s.src && s.src.includes('main.js'));
    addDebugLine(debugInfo, 'Main script', mainScriptLoaded ? 'Loaded' : 'Not loaded', mainScriptLoaded);
}

// Add a line to the debug info panel
function addDebugLine(container, label, value, isSuccess = null) {
    const line = document.createElement('div');
    line.className = 'flex justify-between';
    
    const labelEl = document.createElement('span');
    labelEl.className = 'font-medium';
    labelEl.textContent = label + ':';
    
    const valueEl = document.createElement('span');
    if (isSuccess !== null) {
        valueEl.className = isSuccess ? 'text-green-400' : 'text-red-400';
    }
    valueEl.textContent = value;
    
    line.appendChild(labelEl);
    line.appendChild(valueEl);
    container.appendChild(line);
}

// Add a debug mode query param handler
window.enableDebugMode = function() {
    localStorage.setItem('debugMode', 'true');
    addDebugPanel();
}

// Initialize debug mode if enabled
if (window.location.search.includes('debug=true') || localStorage.getItem('debugMode') === 'true') {
    window.addEventListener('DOMContentLoaded', function() {
        addDebugPanel();
    });
}
