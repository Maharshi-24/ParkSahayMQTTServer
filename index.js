import express from 'express';
import mqtt from 'mqtt';

const app = express();
const port = process.env.PORT || 3000;

// Store statuses in memory
const deviceStatus = {}; // e.g., { PARKING_SLOT_01: "HIGH" }

const MQTT_BROKER = 'mqtt://your-broker-host:1883';
const client = mqtt.connect(MQTT_BROKER);

// Subscribe to all status messages from any parking slot
const topic = 'sensors/+/status';

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic, (err) => {
    if (err) console.error('Subscribe error:', err);
    else console.log(`Subscribed to topic: ${topic}`);
  });
});

client.on('message', (topic, message) => {
  const parts = topic.split('/');
  const deviceId = parts[1];
  const status = message.toString();

  deviceStatus[deviceId] = status;
  console.log(`[${deviceId}] => ${status}`);
});

// Optional API to get latest statuses
app.get('/status', (req, res) => {
  res.json(deviceStatus);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
