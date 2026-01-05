const { Client } = require('basic-ftp');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// FTP Configuration
const FTP_CONFIG = {
  host: '82.25.107.25',
  user: 'u550740391.samepinchh.com',
  password: 'Samepinchh#826991',
  port: 21,
  secure: false, // Use plain FTP (not FTPS)
};

const REMOTE_DIR = '/public_html';
const LOCAL_DIR = path.join(__dirname, '..', 'out');

async function deploy() {
  console.log('🚀 Starting deployment...\n');

  // Step 1: Build the project
  console.log('📦 Building Next.js project...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Build completed successfully!\n');
  } catch (error) {
    console.error('❌ Build failed!', error.message);
    process.exit(1);
  }

  // Step 2: Check if out directory exists
  if (!fs.existsSync(LOCAL_DIR)) {
    console.error('❌ Build output directory not found:', LOCAL_DIR);
    process.exit(1);
  }

  // Step 3: Connect to FTP and upload
  console.log('📤 Connecting to FTP server...');
  const client = new Client();
  
  try {
    await client.access(FTP_CONFIG);
    console.log('✅ Connected to FTP server!\n');

    // Change to remote directory
    console.log(`📁 Changing to remote directory: ${REMOTE_DIR}`);
    await client.ensureDir(REMOTE_DIR);
    await client.cd(REMOTE_DIR);
    console.log('✅ Changed to remote directory\n');

    // Upload all files recursively
    console.log('📤 Uploading files...');
    await client.uploadFromDir(LOCAL_DIR);
    console.log('✅ All files uploaded successfully!\n');

    console.log('🎉 Deployment completed successfully!');
  } catch (error) {
    console.error('❌ FTP upload failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run deployment
deploy().catch((error) => {
  console.error('❌ Deployment error:', error);
  process.exit(1);
});






