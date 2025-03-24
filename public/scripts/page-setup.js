/**
 * Page setup utility to ensure consistent metadata and script loading
 */

// Add meta tags for SEO and sharing
export function addMetaTags(options = {}) {
    const {
        title = 'Infinity 2025',
        description = 'The premier techno-cultural fest organized by Faculty of Engineering and Technology, Jain University',
        keywords = 'Infinity 2025, tech fest, cultural fest, Jain University, Bangalore',
        ogImage = '../public/images/INFINITY GOLD LOGO 24.png'
    } = options;
    
    // Set document title
    document.title = title;
    
    // Helper to create/update meta tags
    function setMetaTag(name, content, property = null) {
        let meta = document.querySelector(property ? 
            `meta[property="${property}"]` : 
            `meta[name="${name}"]`);
            
        if (!meta) {
            meta = document.createElement('meta');
            if (property) {
                meta.setAttribute('property', property);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }
    
    // Set basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    
    // Set Open Graph meta tags
    setMetaTag('og:title', title, 'og:title');
    setMetaTag('og:description', description, 'og:description');
    setMetaTag('og:image', ogImage, 'og:image');
    setMetaTag('og:type', 'website', 'og:type');
    
    // Set Twitter card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);
}

// Load required scripts dynamically
export function loadScript(src, async = true, defer = false) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(); // Script already loaded
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        
        document.head.appendChild(script);
    });
}

// Initialize page with required scripts
export async function initializePage(options = {}) {
    const { 
        requiresSupabase = true,
        requiresFontAwesome = true,
        requiresTailwind = true,
        metaTags = {}
    } = options;
    
    // Add meta tags
    addMetaTags(metaTags);
    
    // Load required scripts
    const promises = [];
    
    if (requiresTailwind) {
        promises.push(loadScript('https://cdn.tailwindcss.com'));
    }
    
    if (requiresFontAwesome) {
        promises.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js'));
    }
    
    if (requiresSupabase) {
        promises.push(loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'));
        promises.push(loadScript('../public/scripts/supabase-config.js'));
    }
    
    try {
        await Promise.all(promises);
        console.log('All required scripts loaded successfully');
        return true;
    } catch (error) {
        console.error('Failed to load required scripts:', error);
        return false;
    }
}
