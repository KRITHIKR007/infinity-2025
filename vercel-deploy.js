#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * This script runs during Vercel deployments to set up the database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if this is a Vercel build environment
const isVercel = process.env.VERCEL === '1';

// Function to log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to run a command
function runCommand(command) {
  log(`Running command: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    log(`Command output: ${output}`);
    return true;
  } catch (error) {
    log(`Command failed: ${error.message}`);
    return false;
  }
}

// Main function to run deployment tasks
async function deploy() {
  log('Starting deployment tasks');
  
  if (!isVercel) {
    log('Not running in Vercel environment, skipping deployment tasks');
    return;
  }
  
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    log('Supabase environment variables not set');
  } else {
    log('Supabase environment variables found');
  }
  
  // Run database setup if SUPABASE_SERVICE_KEY is available
  if (process.env.SUPABASE_SERVICE_KEY) {
    log('SUPABASE_SERVICE_KEY found, running database setup');
    runCommand('node supabase-setup.js');
  } else {
    log('SUPABASE_SERVICE_KEY not found, skipping database setup');
  }
  
  log('Deployment tasks completed');
}

// Run the deployment
deploy().catch(error => {
  log(`Deployment error: ${error.message}`);
  process.exit(1);
});

module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/index.html',
                permanent: true,
            },
        ];
    },
};
