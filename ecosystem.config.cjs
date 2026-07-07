module.exports = {
  apps: [
    {
      name: "heartfire-find-ta",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3020",
        FIND_TA_DATA_DIR: "/var/lib/heartfire-find-ta/.local-data"
      }
    }
  ]
};
