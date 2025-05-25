module.exports = {
  apps: [
    {
      name: 'advanced-web-scraper',
      script: './dist/app.js', // Path to the compiled app entry point
      instances: 'max', // Use maximum instances
      exec_mode: 'cluster', // Enable clustering
      watch: false, // Disable watching for changes
      env: {
        NODE_ENV: 'production', // Set the environment to production
        DATABASE_URL: 'sqlite:./src/database/sqlite.db', // Database connection string
        PORT: 3000, // Port for the application
      },
      env_development: {
        NODE_ENV: 'development', // Set the environment to development
        DATABASE_URL: 'sqlite:./src/database/sqlite.db', // Database connection string
        PORT: 3000, // Port for the application
      },
      env_test: {
        NODE_ENV: 'test', // Set the environment to test
        DATABASE_URL: 'sqlite:./src/database/sqlite.db', // Database connection string
        PORT: 3000, // Port for the application
      },
    },
  ],
};