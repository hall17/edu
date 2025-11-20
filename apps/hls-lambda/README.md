# HLS Video Converter

Convert videos to HLS (HTTP Live Streaming) format with multiple quality variants. This project works both as an AWS Lambda function and as a local script for testing.

## Features

- Convert videos to HLS format with adaptive bitrate streaming
- Multiple quality presets: 360p, 480p, 720p, 1080p, 2K
- Separate folder structure for each quality level
- Master playlist for seamless quality switching
- AWS Lambda deployment ready
- Local testing support

## Quality Presets

| Quality | Resolution | Video Bitrate | Audio Bitrate |
| ------- | ---------- | ------------- | ------------- |
| 360p    | 640x360    | 800k          | 96k           |
| 480p    | 854x480    | 1400k         | 128k          |
| 720p    | 1280x720   | 2800k         | 128k          |
| 1080p   | 1920x1080  | 5000k         | 192k          |
| 2k      | 2560x1440  | 8000k         | 192k          |

**Default qualities**: 360p, 720p, 1080p

## Prerequisites

- Node.js 18.x or higher
- FFmpeg installed (for local testing)
- AWS Account (for Lambda deployment)

## Installation

```bash
npm install
```

## Usage

### Local Testing

The `test-local.js` script allows you to test the conversion locally on your machine.

#### Basic Usage (Default Qualities)

Convert a video using default qualities (360p, 720p, 1080p):

```bash
node test-local.js video.mp4
```

#### Custom Qualities

Specify custom qualities as a comma-separated list:

```bash
# Use specific qualities
node test-local.js video.mp4 360p,480p,720p

# High quality only
node test-local.js video.mp4 720p,1080p,2k

# Single quality
node test-local.js video.mp4 480p

# Custom combination
node test-local.js video.mp4 360p,1080p
```

#### Output

The converted files will be saved in `output_folder/<video-name>/`:

```
output_folder/
└── video/
    ├── master.m3u8          # Master playlist
    ├── 360p/
    │   ├── playlist.m3u8
    │   ├── segment_000.ts
    │   ├── segment_001.ts
    │   └── ...
    ├── 720p/
    │   ├── playlist.m3u8
    │   ├── segment_000.ts
    │   └── ...
    └── 1080p/
        ├── playlist.m3u8
        ├── segment_000.ts
        └── ...
```

### AWS Lambda Deployment

#### 1. Package the Lambda Function

```bash
npm run build
```

This will create a `lambda-deployment.zip` file ready for deployment.

#### 2. Deploy to AWS Lambda

**Option A: AWS Console**

- Upload the `lambda-deployment.zip` file directly in the Lambda console

**Option B: AWS CLI**

```bash
aws lambda update-function-code --function-name hls-converter --zip-file fileb://lambda-deployment.zip
```

**Option C: AWS SAM**

```bash
sam deploy --guided
```

#### 3. Invoke Lambda Function

Send an event to the Lambda function with the following structure:

```json
{
  "sourceBucket": "my-input-bucket",
  "sourceKey": "videos/input-video.mp4",
  "destinationBucket": "my-output-bucket",
  "destinationPrefix": "hls/",
  "qualities": ["360p", "720p", "1080p"]
}
```

**Parameters:**

- `sourceBucket` (required): S3 bucket containing the input video
- `sourceKey` (required): S3 key (path) to the input video
- `destinationBucket` (required): S3 bucket for HLS output files
- `destinationPrefix` (optional): Prefix for output files (default: "hls/")
- `qualities` (optional): Array of quality levels (default: ["360p", "720p", "1080p"])

#### Example: Custom Qualities in Lambda

```json
{
  "sourceBucket": "my-videos",
  "sourceKey": "raw/meeting.mp4",
  "destinationBucket": "my-hls-videos",
  "destinationPrefix": "converted/",
  "qualities": ["480p", "720p", "1080p", "2k"]
}
```

#### Lambda Response

Success response:

```json
{
  "statusCode": 200,
  "body": {
    "message": "HLS conversion completed successfully",
    "videoId": "input-video",
    "sourceBucket": "my-input-bucket",
    "sourceKey": "videos/input-video.mp4",
    "destinationBucket": "my-output-bucket",
    "destinationPrefix": "hls/input-video",
    "filesUploaded": 12,
    "masterPlaylist": "hls/input-video/master.m3u8",
    "files": [...]
  }
}
```

## Environment Variables

### Local Testing

- `FFMPEG_PATH`: Path to FFmpeg binary (default: system ffmpeg)

### AWS Lambda

- `AWS_REGION`: AWS region (default: us-east-1)
- `SOURCE_BUCKET`: Default source bucket
- `DESTINATION_BUCKET`: Default destination bucket
- `FFMPEG_PATH`: Path to FFmpeg binary (auto-detected)

## Project Structure

```
hls-lambda/
├── index.js              # Core Lambda handler and conversion logic
├── test-local.js         # Local testing script
├── package.json          # Dependencies and build scripts
├── template.sam.json     # SAM deployment template
├── ffmpeg                # FFmpeg binary (for deployment)
└── output_folder/        # Local test output directory
```

## How It Works

1. **Input**: Video file (local file or from S3)
2. **Processing**: FFmpeg converts the video into multiple quality variants
3. **Output**: HLS playlist files (.m3u8) and video segments (.ts)
4. **Storage**: Files are saved locally or uploaded to S3

Each quality variant is processed in parallel for faster conversion.

## Playback

To play the converted HLS video, use any HLS-compatible player with the master playlist URL:

```javascript
// Example with video.js
const player = videojs('my-video');
player.src({
  src: 'https://my-bucket.s3.amazonaws.com/hls/video/master.m3u8',
  type: 'application/x-mpegURL',
});
```

## Troubleshooting

### Local Testing Issues

**FFmpeg not found:**

```bash
# Install FFmpeg
# Mac
brew install ffmpeg

# Windows (using Chocolatey)
choco install ffmpeg

# Linux
apt-get install ffmpeg
```

**Permission denied:**

```bash
chmod +x ffmpeg
```

**Build errors:**

Make sure you have all dependencies installed before building:

```bash
npm install
npm run build
```

### Lambda Issues

**Timeout errors:**

- Increase Lambda timeout (recommended: 5-15 minutes for large videos)
- Increase memory allocation (recommended: 2048 MB or more)

**Out of storage:**

- Lambda /tmp has 512 MB limit
- For larger videos, consider using EFS or processing in chunks

## License

MIT
