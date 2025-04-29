import mqtt from "mqtt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Read variables
const {
  MQTT_USERNAME,
  MQTT_PASSWORD,
  MQTT_BROKER_URL,
  MQTT_PORT,
} = process.env;

// MQTT connection options
const options = {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  port: parseInt(MQTT_PORT),
  protocol: "mqtts",
};

// Connect to HiveMQ Cloud
const client = mqtt.connect(MQTT_BROKER_URL, options);

client.on("connect", () => {
  console.log("✅ Connected to HiveMQ Cloud");

  const topic = "iot/render";

  // Subscribe to topic
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("❌ Subscription error:", err.message);
    } else {
      console.log(`📡 Subscribed to topic: ${topic}`);
    }
  });

  // Optional: publish a test message
  client.publish(topic, "📢 Hello from Render!", (err) => {
    if (err) {
      console.error("❌ Publish error:", err.message);
    } else {
      console.log("📤 Message published");
    }
  });
});

// Log messages from broker
client.on("message", (topic, message) => {
  console.log(`📥 Message from [${topic}]: ${message.toString()}`);
});

// Handle errors
client.on("error", (err) => {
  console.error("❌ MQTT Error:", err.message);
});

// On disconnect
client.on("close", () => {
  console.log("🔌 Disconnected from broker");
});
