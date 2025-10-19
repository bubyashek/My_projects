import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyFolderRecursiveSync(source, target) {
    // Check if target folder exists, if not create it
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    // Check if source is a directory
    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);
        
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            const curTarget = path.join(target, file);
            
            if (fs.lstatSync(curSource).isDirectory()) {
                // Recursive call for directories
                copyFolderRecursiveSync(curSource, curTarget);
            } else {
                // Copy file
                fs.copyFileSync(curSource, curTarget);
                console.log(`Copied: ${curSource} -> ${curTarget}`);
            }
        });
    }
}

// Main copy function
async function copyAssets() {
    try {
        console.log('Starting to copy assets...');
        
        // Copy views folder
        const viewsSource = path.join(__dirname, 'src', 'views');
        const viewsTarget = path.join(__dirname, 'dist', 'views');
        console.log(`Copying views from ${viewsSource} to ${viewsTarget}`);
        copyFolderRecursiveSync(viewsSource, viewsTarget);
        
        // Copy public folder
        const publicSource = path.join(__dirname, 'src', 'public');
        const publicTarget = path.join(__dirname, 'dist', 'public');
        console.log(`Copying public from ${publicSource} to ${publicTarget}`);
        copyFolderRecursiveSync(publicSource, publicTarget);
        
        console.log('Assets copied successfully!');
    } catch (error) {
        console.error('Error copying assets:', error);
        process.exit(1);
    }
}

copyAssets();