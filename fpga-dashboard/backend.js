// backend.js - Node.js server for UART communication
const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Serial port configuration
let serialPort = null;
let parser = null;

// Initialize serial port
function initSerial(portName = 'COM3', baudRate = 9600) { // Change COM3 to your port
    try {
        serialPort = new SerialPort({
            path: portName,
            baudRate: baudRate,
            dataBits: 8,
            parity: 'none',
            stopBits: 1
        });

        parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
        
        serialPort.on('open', () => {
            console.log(`Serial port ${portName} opened at ${baudRate} baud`);
        });

        parser.on('data', (data) => {
            console.log('Received from FPGA:', data);
            
            // Send to all WebSocket clients
            const message = {
                type: 'uart_response',
                data: data.trim(),
                timestamp: Date.now(),
                protocol: 'UART'
            };
            
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        });

        serialPort.on('error', (err) => {
            console.error('Serial port error:', err);
        });

    } catch (error) {
        console.error('Failed to initialize serial port:', error);
    }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received from client:', data);
            
            if (data.type === 'send_data') {
                sendToFPGA(data.message, data.protocol);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to send data to FPGA
function sendToFPGA(message, protocol) {
    if (!serialPort || !serialPort.isOpen) {
        console.error('Serial port not available');
        return;
    }

    console.log(`Sending "${message}" via ${protocol}`);
    
    // For now, just send the message (since you have UART working)
    serialPort.write(message + '\n', (err) => {
        if (err) {
            console.error('Error writing to serial port:', err);
        } else {
            // Send transmission start event to dashboard
            const startMessage = {
                type: 'transmission_start',
                message: message,
                protocol: protocol,
                timestamp: Date.now()
            };
            
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(startMessage));
                }
            });
        }
    });
}

// API endpoint to get available serial ports
app.get('/api/ports', async (req, res) => {
    try {
        const ports = await SerialPort.list();
        res.json(ports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to connect to specific port
app.post('/api/connect', (req, res) => {
    const { port, baudRate } = req.body;
    
    if (serialPort && serialPort.isOpen) {
        serialPort.close();
    }
    
    initSerial(port, baudRate);
    res.json({ success: true });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Try to initialize serial port with default settings
    initSerial();
});

// Graceful shutdown
process.on('SIGINT', () => {
    if (serialPort && serialPort.isOpen) {
        serialPort.close();
    }
    process.exit();
});