exports.SECRET = process.env.SECRET;
exports.URL = process.env.URL;

// DB Config
exports.DB_URL = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0`;
exports.DB_OPTIONS = {
  // ssl: true,
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false,
  auto_reconnect: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  // reconnectTries: 10,
  // reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 50,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
exports.DB_NAME = process.env.DB_NAME || 'fast-food';
exports.API_KEY = process.env.API_KEY;

// Cloudinary ENV Variables
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;