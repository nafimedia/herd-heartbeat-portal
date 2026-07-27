import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const projectRoot = path.dirname(scriptDir);
const publicPath = path.join(projectRoot, '.output', 'public', 'assets');
const indexPath = path.join(projectRoot, '.output', 'public', 'index.html');

try {
  // Find the main index-*.js file and styles-*.css file
  const files = fs.readdirSync(publicPath);
  const indexJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  const stylesCss = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));

  if (!indexJs || !stylesCss) {
    throw new Error(`Missing required assets: indexJs=${indexJs}, stylesCss=${stylesCss}`);
  }

  // Generate index.html with correct asset paths
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Farm Portal - KARTANING</title>
    <link rel="stylesheet" href="/assets/${stylesCss}" />
    <link rel="icon" href="/images/logomindajaya.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/${indexJs}"><\/script>
</body>
</html>`;

  fs.writeFileSync(indexPath, indexHtml);
  console.log('✓ Generated .output/public/index.html with correct asset hashes');
  console.log(`  - CSS: ${stylesCss}`);
  console.log(`  - JS:  ${indexJs}`);
} catch (error) {
  console.error('✗ Failed to generate index.html:', error.message);
  process.exit(1);
}
