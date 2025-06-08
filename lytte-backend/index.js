import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import vendorRoutes from './Routes/vendor.js';
import buyerRoutes from './Routes/buyer.js';
import catRoutes from './Routes/category.js';
import deliveryRoutes from './Routes/deliveryAgent.js';
import requirementRoutes from './Routes/requirement.js';
import supplyRoutes from './Routes/supply.js';
import notificationRoutes from './Routes/notification.js';
import orderRoutes from './Routes/Order.js';
import AuthRoutes from './Routes/authorization.js';
import morgan from 'morgan';
import { verifyToken } from './middleware/authorizationMiddleware.js';
import other from './Routes/other.js'
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const allowedOrigins = [
  'https://crap-cycle-dashboard.vercel.app',
  'https://crapycycle.vercel.app', // Add your additional origin here
  'http://localhost:5173',
  'http://localhost:5174',

  

];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));




// Update your custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

// app.use(cors(corsOptions))
app.use(cookieParser());

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

app.use('/api/vendor', vendorRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/category', catRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/requirement', requirementRoutes);  // Pass wss to the routes
app.use('/api/supply', supplyRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/Autharization', AuthRoutes);
app.use('/api/other', other);
app.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to this route", user: req.user });
});

wss.on('connection', (ws, req) => {
  console.log('New client connected');

  // Assume the vendor ID is sent as a query parameter during connection
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const vendorId = urlParams.get('v_id');

  // Store the vendor ID on the WebSocket connection object
  ws.vendorId = vendorId;

  // Send a welcome message to the newly connected client
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default wss;