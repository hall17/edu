import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const classFilePath = path.join(
  __dirname,
  'generated',
  'prisma',
  'internal',
  'class.ts'
);

const enumsFilePath = path.join(__dirname, 'generated', 'prisma', 'enums.ts');

const commonPackagePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'packages',
  'common'
);

function updateConfig(): void {
  try {
    let content = fs.readFileSync(classFilePath, 'utf8');
    // Replace 'const config' with 'export const config'
    content = content.replace(/const config/g, 'export const config');
    fs.writeFileSync(classFilePath, content);
    console.log('Successfully updated class.ts to export config.');
  } catch (error) {
    console.error('Error updating class.ts:', (error as Error).message);
    process.exit(1);
  }
}

function copyEnumsToCommon(): void {
  fs.copyFileSync(
    enumsFilePath,
    path.join(commonPackagePath, 'src', 'enums.ts')
  );
  console.log('Successfully copied enums.ts to packages/common/src/enums.ts.');

  // take new build for @edusama/common
  execSync('yarn workspace @edusama/common build');
}

updateConfig();
copyEnumsToCommon();
