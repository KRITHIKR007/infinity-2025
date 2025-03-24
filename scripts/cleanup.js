/**
 * File Cleanup Utility for Infinity-2K25 Project
 * 
 * This script helps identify and delete unwanted files in the project
 * such as temporary files, backup files, and development artifacts.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration - file patterns to search for
const UNWANTED_PATTERNS = [
  // Temp files
  /\.tmp$/,
  /\.temp$/,
  /~$/,
  
  // Backup files
  /\.bak$/,
  /\.backup$/,
  /\.old$/,
  
  // Log files
  /\.log$/,
  
  // IDE/editor files
  /\.DS_Store$/,
  /Thumbs\.db$/,
  /desktop\.ini$/,
  
  // Development artifacts
  /\.env\.local$/,
  /\.env\.development$/
];

// Directories to ignore
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.vscode',
  '.idea'
];

// Root directory to start from (default is project root)
const ROOT_DIR = path.resolve(__dirname, '..');

// Storage for found files
const foundFiles = [];

/**
 * Scan directory recursively for unwanted files
 */
function scanDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip ignored directories
        if (IGNORE_DIRS.includes(entry.name)) {
          continue;
        }
        
        // Recursively scan subdirectories
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        // Check if file matches any unwanted pattern
        if (UNWANTED_PATTERNS.some(pattern => pattern.test(entry.name))) {
          foundFiles.push({
            path: fullPath,
            name: entry.name,
            size: fs.statSync(fullPath).size
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

/**
 * Format file size for display (KB, MB, etc.)
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Delete files with user confirmation
 */
async function deleteFiles(filesToDelete) {
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(file.path);
      console.log(`✅ Deleted: ${file.path}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${file.path}: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total files: ${filesToDelete.length}`);
  console.log(`Successfully deleted: ${successCount}`);
  
  if (errorCount > 0) {
    console.log(`Failed to delete: ${errorCount}`);
  }
}

/**
 * Ask user for confirmation before deleting
 */
function confirmDeletion(callback) {
  if (foundFiles.length === 0) {
    console.log('No unwanted files found. Nothing to delete.');
    rl.close();
    return;
  }
  
  // Calculate total size
  const totalSize = foundFiles.reduce((sum, file) => sum + file.size, 0);
  
  // Display found files
  console.log('\n=== Unwanted Files Found ===');
  foundFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} (${formatFileSize(file.size)})`);
  });
  console.log(`\nTotal: ${foundFiles.length} files (${formatFileSize(totalSize)})`);
  
  // Prompt for confirmation
  rl.question('\nDo you want to delete these files? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      callback(foundFiles);
    } else {
      console.log('Operation cancelled. No files were deleted.');
    }
    rl.close();
  });
}

/**
 * Allow selection of specific files to delete
 */
function selectFilesToDelete() {
  if (foundFiles.length === 0) {
    console.log('No unwanted files found. Nothing to delete.');
    rl.close();
    return;
  }
  
  console.log('\n=== Select Files to Delete ===');
  console.log('Enter file numbers separated by commas (e.g., 1,3,5)');
  console.log('Enter "all" to select all files');
  console.log('Enter "none" to cancel');
  
  // Display found files with numbers
  foundFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} (${formatFileSize(file.size)})`);
  });
  
  rl.question('\nYour selection: ', (answer) => {
    answer = answer.trim().toLowerCase();
    
    if (answer === 'none' || answer === '') {
      console.log('Operation cancelled. No files were deleted.');
      rl.close();
      return;
    }
    
    if (answer === 'all') {
      confirmDeletion(deleteFiles);
      return;
    }
    
    // Parse selection numbers
    try {
      const selected = answer.split(',')
        .map(num => parseInt(num.trim(), 10) - 1)
        .filter(index => !isNaN(index) && index >= 0 && index < foundFiles.length);
      
      if (selected.length === 0) {
        console.log('No valid files selected. Operation cancelled.');
        rl.close();
        return;
      }
      
      const selectedFiles = selected.map(index => foundFiles[index]);
      
      // Show selected files and confirm
      console.log('\nSelected files:');
      selectedFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file.path} (${formatFileSize(file.size)})`);
      });
      
      rl.question('\nConfirm deletion? (yes/no): ', (confirm) => {
        if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
          deleteFiles(selectedFiles);
        } else {
          console.log('Operation cancelled. No files were deleted.');
        }
        rl.close();
      });
      
    } catch (error) {
      console.error('Invalid selection. Operation cancelled.');
      rl.close();
    }
  });
}

// Main execution
console.log('🔍 Scanning for unwanted files...');
console.log(`Starting in directory: ${ROOT_DIR}`);

scanDirectory(ROOT_DIR);

// After scanning, ask for deletion preference
rl.question('Select deletion mode:\n1. Delete all found files\n2. Select specific files\nEnter choice (1/2): ', (answer) => {
  if (answer === '1') {
    confirmDeletion(deleteFiles);
  } else if (answer === '2') {
    selectFilesToDelete();
  } else {
    console.log('Invalid choice. Operation cancelled.');
    rl.close();
  }
});
