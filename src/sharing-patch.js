const fs = require('fs');
const path = require('path');

const filePath = path.join(
  process.cwd(),
  'node_modules',
  'expo-sharing',
  'build',
  'Sharing.js'
);

const content = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(
  filePath,
  content.replace(/import \{ UnavailabilityError \} from 'expo-modules-core'/, 
  "const { UnavailabilityError } = require('expo-modules-core')")
);