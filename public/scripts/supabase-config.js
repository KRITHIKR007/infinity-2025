// Initialize Supabase client configuration
const SUPABASE_URL = 'https://ceickbodqhwfhcpabfdq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaWNrYm9kcWh3ZmhjcGFiZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzU2MTgsImV4cCI6MjA1NzkxMTYxOH0.ZyTG1FkQzjQ0CySlyvkQEYPHWBbZJd--vsB_IqILuo8';

// Table constants
const TABLES = {
    REGISTRATIONS: 'registrations',
    EVENTS: 'events',
    PAYMENTS: 'payments',
    STORAGE: {
        PAYMENT_PROOFS: 'payment_proofs'
    }
};

// Initialize Supabase client when this script is loaded
let supabase;

function initSupabase() {
    if (typeof supabaseClient !== 'undefined') {
        return supabaseClient;
    }
    
    if (typeof supabase !== 'undefined') {
        return supabase;
    }
    
    if (typeof window.supabase !== 'undefined') {
        return window.supabase;
    }
    
    try {
        if (typeof window.supabase === 'undefined') {
            // Check if the Supabase client exists globally
            if (typeof supabaseJs !== 'undefined') {
                window.supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } else {
                // Fallback to global 'supabase' object if available
                window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        }
        
        return window.supabase;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return null;
    }
}

// Ensure Supabase client is available globally
window.supabaseConfig = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    tables: TABLES,
    initSupabase: initSupabase
};

// Execute initialization when the script is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Supabase client...');
    const client = initSupabase();
    if (client) {
        console.log('Supabase client initialized successfully');
    } else {
        console.error('Failed to initialize Supabase client');
    }
});
