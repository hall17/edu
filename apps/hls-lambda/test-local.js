const fs = require('fs');
const path = require('path');

// Configure FFmpeg path for Windows local environment
process.env.FFMPEG_PATH = 'ffmpeg'; // Use system ffmpeg on Windows

// Import the core processing logic from index.js
const { processVideoToHLS } = require('./index.js');

/**
 * Main test function
 */
async function testLocal() {
  // Get input file and optional qualities from command line arguments
  const args = process.argv.slice(2).filter((arg) => arg !== '--'); // Remove -- separator
  const inputFile = args[0];
  console.log('Args:', args);
  // Get qualities argument (can be comma-separated or multiple args)
  const qualitiesArgs = args.slice(1);
  console.log('Qualities Args:', qualitiesArgs);
  const qualitiesArg =
    qualitiesArgs.length > 0
      ? qualitiesArgs.length === 1
        ? qualitiesArgs[0].split(' ').join(',')
        : qualitiesArgs.join(',')
      : '';

  if (!inputFile) {
    console.error('Usage: node test-local.js <input-video-file> [qualities]');
    console.error('Example: node test-local.js sample.mp4');
    console.error('Example: node test-local.js sample.mp4 360p,480p,720p');
    console.error('Example: node test-local.js sample.mp4 720p,1080p,2k');
    console.error('Example: yarn test-local -- sample.mp4 360p,480p,720p');
    console.error('\nAvailable qualities: 360p, 480p, 720p, 1080p, 2k');
    console.error('Default: 360p,720p,1080p');
    process.exit(1);
  }

  const inputPath = path.resolve(__dirname, inputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Parse qualities from command line or use defaults
  const qualities = qualitiesArg
    ? qualitiesArg
        .split(',')
        .map((q) => q.trim())
        .filter(Boolean)
    : ['360p', '720p', '1080p'];

  const videoId = path.basename(inputFile, path.extname(inputFile));
  const outputDir = path.join(__dirname, 'output_folder', videoId);

  console.log('Starting local HLS conversion...');
  console.log('Input file:', inputPath);
  console.log('Output directory:', outputDir);
  console.log('Qualities:', qualities.join(', '));
  console.log('FFmpeg path:', process.env.FFMPEG_PATH);

  try {
    // Use the shared processing logic from index.js
    const result = await processVideoToHLS(inputPath, outputDir, qualities);
    console.log('\n✅ Conversion completed successfully!');
    console.log('Result:', result);
    console.log('\nOutput files:');
    result.files.forEach((file) => console.log(`  - ${file}`));
    console.log('\nMaster playlist:', path.join(outputDir, 'master.m3u8'));
  } catch (error) {
    console.error('\n❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testLocal();
