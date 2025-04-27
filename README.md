# ParkSahayMQTTServer

MQTT subscriber server for the ParkSahay IoT parking system. This server connects to an MQTT broker to receive parking sensor data and provides a REST API to access the current state of parking spots.

## Features

- Subscribes to MQTT topics for parking sensor data
- Provides REST API endpoints to access parking spot status
- Designed for deployment on Render

## Deployment on Render

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan if needed)

### Environment Variables

Set the following environment variables in the Render dashboard:

- `PORT`: 3000 (or let Render assign a port)
- `MQTT_BROKER_URL`: The URL of your MQTT broker (e.g., `mqtt://your-broker-ip-or-domain`)

#### Temporary Setup

If you haven't set up your own MQTT broker yet, you can use a public test broker temporarily:

- `MQTT_BROKER_URL`: `mqtt://broker.hivemq.com`

Note: Authentication is not required for the public test broker. If you set up your own broker with authentication later, you can add the necessary environment variables at that time.

**Important**: The public test broker should only be used for testing. It's not secure for production use and has limitations on connection time and message size. Replace with your own broker as soon as possible.

### Automatic Deployment with render.yaml

This repository includes a `render.yaml` file for automatic deployment. You can use the "Blueprint" feature in Render to deploy directly from this configuration.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set environment variables:
   ```
   export MQTT_BROKER_URL=mqtt://your-broker-ip-or-domain
   export MQTT_USERNAME=your-username (if needed)
   export MQTT_PASSWORD=your-password (if needed)
   ```
4. Start the server: `npm start`

## API Endpoints

- `GET /`: Health check endpoint
- `GET /api/devices`: Get the current status of all parking sensors
