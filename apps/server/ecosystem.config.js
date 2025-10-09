module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/src/server.js',
      instances: 1,
      autorestarts: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: 'err.log',
      ot_file: 'out.log',
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
      merge_logs: true,
    },
  ],
};
