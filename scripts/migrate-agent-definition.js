/**
 * Helper script to run Prisma migrations for the AgentDefinition model
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the scripts directory exists
const scriptsDir = path.resolve(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

console.log('Running Prisma migration for AgentDefinition model...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Create migration
  console.log('Creating migration...');
  execSync('npx prisma migrate dev --name add_agent_definition', { stdio: 'inherit' });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Error running migration:', error.message);
  process.exit(1);
}
