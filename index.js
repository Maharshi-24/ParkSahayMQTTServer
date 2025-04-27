import mqtt from 'mqtt';
import express from 'express';
import cors from 'cors';
import colors from 'colors'; // Install using: npm install colors
import dotenv from 'dotenv'; // For loading environment variables from .env file

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MQTT Setup
const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost'; // Use environment variable or default to localhost
console.log(`[MQTT] Connecting to broker: ${brokerUrl}`);

// MQTT connection options
const mqttOptions = {
  clientId: `render-subscriber-server-${Math.random().toString(16).substring(2, 8)}`, // Add random suffix to avoid client ID conflicts
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

// Add authentication if provided in environment variables
if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
  mqttOptions.username = process.env.MQTT_USERNAME;
  mqttOptions.password = process.env.MQTT_PASSWORD;
}

const client = mqtt.connect(brokerUrl, mqttOptions);

// Store latest device states
const deviceStates = {}; // Example: { 'module-001': 'HIGH' }

// When connected to broker
client.on('connect', () => {
  console.log(colors.green.bold('[MQTT] Connected to broker ✅'));
  console.log(colors.green(`[MQTT] Using broker: ${brokerUrl}`));

  // Subscribe to all module status updates
  client.subscribe('sensors/+/status', (err) => {
    if (!err) {
      console.log(colors.blue('[MQTT] Subscribed to sensors/+/status 📡'));
    } else {
      console.error(colors.red('[MQTT] Subscription error ❌'), err);
    }
  });
});

// Handle connection errors
client.on('error', (err) => {
  console.error(colors.red('[MQTT] Connection error ❌'), err.message);
  console.log(colors.yellow('[MQTT] Server will continue running, but no MQTT data will be received'));
});

// Handle reconnection attempts
client.on('reconnect', () => {
  console.log(colors.yellow('[MQTT] Attempting to reconnect to broker...'));
});

// When message is received
client.on('message', (topic, message) => {
  const deviceId = topic.split('/')[1]; // sensors/{deviceId}/status
  const status = message.toString();

  deviceStates[deviceId] = status; // Save latest status

  if (status.toUpperCase() === 'HIGH') {
    console.log(colors.green(`[DATA] ${deviceId} ➔ HIGH 🚗`));
  } else if (status.toUpperCase() === 'LOW') {
    console.log(colors.red(`[DATA] ${deviceId} ➔ LOW 🅿️`));
  } else {
    console.log(colors.yellow(`[DATA] ${deviceId} ➔ Unknown Status`));
  }
});

// API to get all device states (for frontend connection)
app.get('/api/devices', (_, res) => {
  res.json(deviceStates);
});

// Health check
app.get('/', (_, res) => {
  res.send('Server and MQTT Subscriber Running! 🚀');
});

// Start Express server
app.listen(PORT, () => {
  console.log(colors.cyan.bold(`[HTTP] Express server started on port ${PORT} 🌐`));
});
