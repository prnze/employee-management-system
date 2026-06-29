const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const workspaceDir = path.join(rootDir, 'workspace');
const angularDistDir = path.join(rootDir, 'dist', 'employee-management-system', 'browser');

try {
  console.log('Assembling application builds...');

  const apps = ['formatx', 'passx', 'filex'];
  apps.forEach(app => {
    const srcDir = path.join(workspaceDir, 'apps', app, 'dist', 'client');
    const destDir = path.join(angularDistDir, app);

    if (!fs.existsSync(srcDir)) {
      throw new Error(`Build directory for React app "${app}" not found at ${srcDir}. Make sure to build the React workspace first.`);
    }

    console.log(`Copying ${app} client build to ${destDir}...`);
    fs.mkdirSync(destDir, { recursive: true });
    fs.cpSync(srcDir, destDir, { recursive: true, force: true });
  });

  console.log('Build integration assembly finished successfully!');
} catch (error) {
  console.error('Assembly step failed:', error.message);
  process.exit(1);
}
