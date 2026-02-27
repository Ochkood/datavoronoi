require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in environment variables');
  }

  await connectDB(process.env.MONGO_URI);

  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Change PORT in backend/.env and restart.`);
      process.exit(1);
    }
    console.error('Server error:', err.message);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
