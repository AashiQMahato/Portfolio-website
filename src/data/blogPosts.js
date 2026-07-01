export const blogPosts = [
  {
    slug: "building-scalable-iot-dashboard",
    title: "Building a Scalable IoT Dashboard with React and MQTT",
    excerpt: "Learn how to connect hardware sensors to a modern React frontend using MQTT over WebSockets for real-time telemetry.",
    date: "2026-04-12",
    category: "IoT",
    readTime: "8 min read",
    content: `
# Building a Scalable IoT Dashboard

In modern IoT applications, real-time data visibility is critical. In this post, I'll walk you through how to connect physical hardware (like an ESP32) to a React web application using MQTT over WebSockets.

## The Architecture

1. **Hardware Node**: ESP32 reading sensor data (temperature, humidity).
2. **Message Broker**: Mosquitto MQTT broker handling pub/sub.
3. **Frontend**: React application subscribing to topics via WebSockets.

### Setting up the ESP32

Using the PubSubClient library in Arduino IDE makes it easy to publish data:

\`\`\`cpp
#include <WiFi.h>
#include <PubSubClient.h>

void loop() {
  float temp = readTemperature();
  client.publish("home/sensors/temp", String(temp).c_str());
  delay(5000);
}
\`\`\`

### Connecting React

On the frontend, we use \`mqtt.js\` to connect over WebSockets.

\`\`\`javascript
import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

const useSensorData = (topic) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');
    
    client.on('connect', () => {
      client.subscribe(topic);
    });

    client.on('message', (topic, message) => {
      setData(message.toString());
    });

    return () => client.end();
  }, [topic]);

  return data;
};
\`\`\`

## Lessons Learned

- Always handle connection dropouts gracefully.
- Use QoS levels appropriately. For telemetry, QoS 0 is often sufficient and reduces overhead.
- Secure your WebSockets with WSS (TLS) in production!
    `
  },
  {
    slug: "mastering-framer-motion",
    title: "Micro-Interactions with Framer Motion",
    excerpt: "Elevate your React applications from good to great with subtle, performant animations using Framer Motion.",
    date: "2026-03-28",
    category: "Frontend",
    readTime: "5 min read",
    content: `
# Micro-Interactions with Framer Motion

Framer Motion is my go-to library for React animations. It makes complex orchestrations simple while keeping performance high.

## The Layout Prop

One of the most powerful features is the \`layout\` prop. It automatically animates components when they change position in the DOM.

\`\`\`jsx
<motion.div layout className="card">
  <h2>Auto-animating card</h2>
</motion.div>
\`\`\`

## Staggered Children

You can easily orchestrate lists using variants:

\`\`\`jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Usage
<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
\`\`\`

Always remember: less is more. Animations should guide the user, not distract them!
    `
  }
];
