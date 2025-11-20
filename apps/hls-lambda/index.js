const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// Initialize S3 Client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'eu-central-1' });
const bucketName = 'edusama-s3';

// FFmpeg binary path - use bundled binary or system binary
const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  (fs.existsSync(path.join(__dirname, 'ffmpeg'))
    ? path.join(__dirname, 'ffmpeg') // Bundled with deployment
    : 'ffmpeg'); // System binary

/**
 * Process video to HLS format
 * This is the core processing function that can be used both in Lambda and locally
 */
async function processVideoToHLS(inputPath, outputDir, qualities = ['360p', '720p', '1080p']) {
  const videoId = path.basename(inputPath, path.extname(inputPath));

  // Step 1: Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 2: Convert to HLS
  console.log('Starting HLS conversion...');
  const conversionResult = await convertToHLS(inputPath, outputDir, qualities);
  console.log('Conversion completed:', conversionResult);

  // Step 3: Generate thumbnail
  console.log('Generating thumbnail...');
  const thumbnailPath = await generateThumbnail(inputPath, outputDir);
  console.log('Thumbnail created:', thumbnailPath);

  return {
    success: true,
    videoId,
    outputDir,
    files: conversionResult.files,
    thumbnail: thumbnailPath ? path.relative(outputDir, thumbnailPath) : null,
  };
}

/**
 * AWS Lambda handler to convert video to HLS format
 * Event structure:
 * {
 *   "key": "videos/input-video.mp4",
 *   "qualities": ["360p", "720p", "1080p"]
 * }
 */
exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));

  const { key, qualities = ['360p', '720p', '1080p'] } = event;

  // Validate required parameters
  if (!key) {
    throw new Error('Missing required parameters: key');
  }

  const videoId = path.basename(key, path.extname(key));
  const inputPath = `/tmp/${path.basename(key)}`;
  const outputDir = `/tmp/output/${videoId}`;

  try {
    // Step 1: Download video from S3
    console.log(`Downloading video from s3://${bucketName}/${key}`);
    await downloadFromS3(bucketName, key, inputPath);
    console.log(`Video downloaded to ${inputPath}`);

    // Step 2: Process video to HLS
    const result = await processVideoToHLS(inputPath, outputDir, qualities);

    // Extract directory path from the source key
    const keyParts = key.split('/');
    keyParts.pop(); // remove last part (filename)
    const destinationPrefix = keyParts.length > 0 ? keyParts.join('/') + '/shared/' : 'shared/';
    console.log('Destination Prefix:', destinationPrefix);

    // Step 3: Upload all HLS files to S3
    console.log('Uploading HLS files to S3...');
    const uploadedFiles = await uploadDirectoryToS3(outputDir, bucketName, destinationPrefix);
    console.log(`Uploaded ${uploadedFiles.length} files to S3`);

    // Step 4: Cleanup temp files
    cleanupTempFiles(inputPath, outputDir);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'HLS conversion completed successfully',
        videoId,
        sourceBucket: bucketName,
        sourceKey: key,
        destinationBucket: bucketName,
        destinationPrefix: destinationPrefix,
        filesUploaded: uploadedFiles.length,
        masterPlaylist: `${destinationPrefix}master.m3u8`,
        files: uploadedFiles,
      }),
    };
  } catch (error) {
    console.error('Error processing video:', error);

    // Cleanup on error
    cleanupTempFiles(inputPath, outputDir);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing video',
        error: error.message,
        videoId,
        key,
      }),
    };
  }
};

// Export the core processing function for local testing
exports.processVideoToHLS = processVideoToHLS;

/**
 * Download file from S3
 */
async function downloadFromS3(bucket, key, destinationPath) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body;

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(destinationPath);

    if (stream instanceof Readable) {
      stream.pipe(writeStream);
    } else {
      // Handle Web Stream API (for newer SDK versions)
      const nodeStream = Readable.from(stream);
      nodeStream.pipe(writeStream);
    }

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

/**
 * Generate thumbnail from video
 */
function generateThumbnail(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(outputDir, 'thumbnail.jpeg');

    const args = [
      '-i',
      inputPath,
      '-ss',
      '00:00:01', // Take screenshot at 1 second
      '-vframes',
      '1', // Extract only 1 frame
      '-vf',
      'scale=1280:720:force_original_aspect_ratio=decrease', // Scale to max 1280x720 maintaining aspect ratio
      '-q:v',
      '2', // High quality (2-5 is good, lower is better)
      thumbnailPath,
    ];

    console.log('Generating thumbnail:', FFMPEG_PATH, args.join(' '));

    const ffmpeg = spawn(FFMPEG_PATH, args);
    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg thumbnail error:', error);
      reject(new Error(`FFmpeg thumbnail process error: ${error.message}`));
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(thumbnailPath);
      } else {
        console.warn(`Thumbnail generation failed with code ${code}, continuing without thumbnail`);
        resolve(null); // Don't fail the whole process if thumbnail fails
      }
    });
  });
}

/**
 * Convert video to HLS format with multiple quality variants
 * Processes each quality separately to create separate folders
 */
async function convertToHLS(inputPath, outputDir, qualities = ['360p', '720p', '1080p']) {
  // Quality settings
  const qualityPresets = {
    '360p': { resolution: '640x360', videoBitrate: '800k', audioBitrate: '96k' },
    '480p': { resolution: '854x480', videoBitrate: '1400k', audioBitrate: '128k' },
    '720p': { resolution: '1280x720', videoBitrate: '2800k', audioBitrate: '128k' },
    '1080p': { resolution: '1920x1080', videoBitrate: '5000k', audioBitrate: '192k' },
    '2k': { resolution: '2560x1440', videoBitrate: '8000k', audioBitrate: '192k' },
  };

  // Process each quality sequentially to avoid memory issues in Lambda
  for (const quality of qualities) {
    if (!qualityPresets[quality]) {
      console.warn(`Quality preset not found for: ${quality}`);
      continue;
    }

    const preset = qualityPresets[quality];
    const qualityDir = path.join(outputDir, quality);

    if (!fs.existsSync(qualityDir)) {
      fs.mkdirSync(qualityDir, { recursive: true });
    }

    await convertSingleQuality(inputPath, qualityDir, quality, preset);
  }

  // Create master playlist
  createMasterPlaylist(outputDir, qualities, qualityPresets);

  const files = getAllFiles(outputDir);
  return {
    success: true,
    outputDir,
    files: files.map((f) => path.relative(outputDir, f)),
  };
}

/**
 * Convert video to a single quality level
 */
function convertSingleQuality(inputPath, outputDir, quality, preset) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i',
      inputPath,
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-preset',
      'medium',
      '-s',
      preset.resolution,
      '-b:v',
      preset.videoBitrate,
      '-maxrate',
      preset.videoBitrate,
      '-bufsize',
      `${parseInt(preset.videoBitrate) * 2}k`,
      '-b:a',
      preset.audioBitrate,
      '-g',
      '48',
      '-keyint_min',
      '48',
      '-sc_threshold',
      '0',
      '-hls_time',
      '10',
      '-hls_playlist_type',
      'vod',
      '-hls_segment_filename',
      path.join(outputDir, 'segment_%03d.ts'),
      '-f',
      'hls',
      path.join(outputDir, 'playlist.m3u8'),
    ];

    console.log(`Converting ${quality}:`, FFMPEG_PATH, args.join(' '));

    const ffmpeg = spawn(FFMPEG_PATH, args);
    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log(`[${quality}]`, data.toString());
    });

    ffmpeg.on('error', (error) => {
      console.error(`FFmpeg error for ${quality}:`, error);
      reject(new Error(`FFmpeg process error for ${quality}: ${error.message}`));
    });

    ffmpeg.on('close', (code) => {
      console.log(`FFmpeg process for ${quality} exited with code ${code}`);

      if (code === 0) {
        resolve({ quality, success: true });
      } else {
        reject(new Error(`FFmpeg exited with code ${code} for ${quality}\n${errorOutput}`));
      }
    });
  });
}

/**
 * Create master playlist that references all quality variants
 */
function createMasterPlaylist(outputDir, qualities, qualityPresets) {
  const lines = ['#EXTM3U', '#EXT-X-VERSION:3'];

  qualities.forEach((quality) => {
    const preset = qualityPresets[quality];
    if (preset) {
      const bandwidth = parseInt(preset.videoBitrate) * 1000 + parseInt(preset.audioBitrate) * 1000;
      const [width, height] = preset.resolution.split('x');

      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${preset.resolution},NAME="${quality}"`
      );
      lines.push(`${quality}/playlist.m3u8`);
    }
  });

  const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
  fs.writeFileSync(masterPlaylistPath, lines.join('\n') + '\n');
  console.log('Master playlist created:', masterPlaylistPath);
}

/**
 * Upload all files in a directory to S3
 */
async function uploadDirectoryToS3(localDir, bucket, s3Prefix) {
  const files = getAllFiles(localDir);
  const uploadPromises = [];
  const uploadedFiles = [];

  for (const file of files) {
    const relativePath = path.relative(localDir, file);
    const s3Key = path.join(s3Prefix, relativePath).replace(/\\/g, '/');

    uploadPromises.push(
      uploadFileToS3(file, bucket, s3Key).then(() => {
        uploadedFiles.push(s3Key);
        console.log(`Uploaded: ${s3Key}`);
      })
    );
  }

  await Promise.all(uploadPromises);
  return uploadedFiles;
}

/**
 * Upload a single file to S3
 */
async function uploadFileToS3(filePath, bucket, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3Client.send(command);
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.ts': 'video/mp2t',
    '.mp4': 'video/mp4',
    '.json': 'application/json',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Cleanup temporary files
 */
function cleanupTempFiles(inputPath, outputDir) {
  try {
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
      console.log(`Deleted temp file: ${inputPath}`);
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      console.log(`Deleted temp directory: ${outputDir}`);
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
}
