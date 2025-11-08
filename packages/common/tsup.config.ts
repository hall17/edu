import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  // Automatically update package.json exports
  // not needed
  // async onSuccess() {
  //   const fs = await import('fs');
  //   const path = await import('path');

  //   const packagePath = path.join(process.cwd(), 'package.json');
  //   const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  //   // Update main and types for CJS build
  //   packageJson.main = './dist/index.js';
  //   packageJson.types = './dist/index.d.ts';

  //   // Add module for ESM support
  //   packageJson.module = './dist/index.mjs';

  //   // Add exports field for better compatibility
  //   packageJson.exports = {
  //     '.': {
  //       types: './dist/index.d.ts',
  //       import: './dist/index.mjs',
  //       require: './dist/index.js',
  //     },
  //   };

  //   fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

  //   console.log('✅ Package.json updated with build outputs:');
  //   console.log(`   Main: ${packageJson.main}`);
  //   console.log(`   Module: ${packageJson.module}`);
  //   console.log(`   Types: ${packageJson.types}`);
  // },
});
