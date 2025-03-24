/**
 * Utility functions for payment validation
 */

// Validate payment screenshot
export function validatePaymentScreenshot(file) {
    return new Promise((resolve, reject) => {
        // Check if file exists
        if (!file) {
            reject(new Error('No file selected'));
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('File size exceeds the maximum limit of 5MB'));
            return;
        }
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            reject(new Error('Invalid file type. Please upload a JPG, PNG, or GIF image'));
            return;
        }
        
        // Create a FileReader to check dimensions
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                // Check dimensions (min 300x300)
                if (img.width < 300 || img.height < 300) {
                    reject(new Error('Image dimensions too small. Please upload a larger image'));
                    return;
                }
                
                // All validations passed
                resolve({
                    width: img.width,
                    height: img.height,
                    size: file.size,
                    type: file.type,
                    name: file.name
                });
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load image. The file may be corrupted'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Check for common payment app elements in the screenshot
export function checkPaymentAppElements(imageData) {
    // This is a placeholder for more advanced validation
    // In a real implementation, this might use image recognition or ML
    // to detect payment app UI elements
    
    return {
        containsPaymentElements: true,
        confidence: 0.75,
        detectedElements: [
            'payment confirmation',
            'transaction ID',
            'amount'
        ]
    };
}

// Format currency amount
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}
