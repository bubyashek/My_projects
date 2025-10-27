const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, 'ssl');

// Создать папку для ssl, если нет
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir);
}

try {
  console.log('🔐 Generating self-signed SSL certificate...');
  
  execSync(
    `openssl req -nodes -new -x509 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`,
    { stdio: 'inherit' }
  );
  
  console.log('✅ SSL certificates generated successfully!');
  console.log('   Key: ssl/key.pem');
  console.log('   Certificate: ssl/cert.pem');
} catch (error) {
  console.error('❌ Error generating SSL certificates:', error.message);
  console.log('   Please make sure OpenSSL is installed on your system.');
  process.exit(1);
}

