import mqtt from 'mqtt';
import express from 'express';
import cors from 'cors';
import colors from 'colors'; // Install using: npm install colors

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MQTT Setup
const brokerUrl = 'mqtt://your-broker-ip-or-url'; // Example: mqtt://broker.hivemq.com
const client = mqtt.connect(brokerUrl, {
  clientId: 'render-subscriber-server', 
  clean: true,
  connectTimeout: 4000,
  username: 'your-optional-username', // if authentication enabled
  password: 'your-optional-password', // if authentication enabled
  reconnectPeriod: 1000,
});

// Store latest device states
const deviceStates = {}; // Example: { 'module-001': 'HIGH' }

// When connected to broker
client.on('connect', () => {
  console.log(colors.green.bold('[MQTT] Connected to broker ✅'));

  // Subscribe to all module status updates
  client.subscribe('sensors/+/status', (err) => {
    if (!err) {
      console.log(colors.blue('[MQTT] Subscribed to sensors/+/status 📡'));
    } else {
      console.error(colors.red('[MQTT] Subscription error ❌'), err);
    }
  });
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
app.get('/api/devices', (req, res) => {
  res.json(deviceStates);
});

// Health check
app.get('/', (req, res) => {
  res.send('Server and MQTT Subscriber Running! 🚀');
});

// Start Express server
app.listen(PORT, () => {
  console.log(colors.cyan.bold(`[HTTP] Express server started on port ${PORT} 🌐`));
});
