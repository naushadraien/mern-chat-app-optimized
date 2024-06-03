import { type IncomingMessage, type Server, type ServerResponse } from 'http';

// Handle unhandled promise rejection and exit the process gracefully occurred anywhere in the application not only in the express
const handleUnhandledRejection = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  process.on('unhandledRejection', (err: Error) => {
    console.error('\nError Name:', err.name, '\nError message:', err.message || err);
    console.log('\nUnhandled rejection occured! Shutting down the server...');

    // Gracefully shut down the server
    server.close(() => {
      console.log('Server closed due to unhandled promise rejection');
      // Exit the process
      process.exit(1); // 0 for success 1 for failure
    });
  });
};

// Handle uncaught exception is the error that is occurred in the synchronous code like calling a function that does not exist or calling a variable that is not defined
const handleUncaughtException = () => {
  return process.on('uncaughtException', (err: Error) => {
    console.error('\nError Name:', err.name, '\nError message:', err.message || err);
    console.log('\nUncaught exception occured! Shutting down the server...');

    // Exit the process
    process.exit(1);
  });
};

export { handleUncaughtException, handleUnhandledRejection };
