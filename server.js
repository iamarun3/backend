require('dotenv').config();  // Load env variables from .env (for local use)

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder (your frontend files)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g. 'localhost' or cloud DB host
  user: process.env.DB_USER,       // e.g. 'root'
  password: process.env.DB_PASSWORD, // your DB password
  database: process.env.DB_NAME    // e.g. 'foodie_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Dine-In Order Endpoint
app.post('/api/dinein', (req, res) => {
  const { name, email, people, orderId, date } = req.body;
  const query = 'INSERT INTO dine_in_orders (name, email, people, order_id, reservation_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, people, orderId, date], (err) => {
    if (err) {
      console.error('Dine-in insert error:', err);
      return res.status(500).json({ message: 'Error saving dine-in order' });
    }
    res.json({ message: 'Dine-in order saved' });
  });
});

// Delivery Order Endpoint
app.post('/api/delivery', (req, res) => {
  const { name, email, phone, order_id, menuItem, quantity, total } = req.body;
  const query = 'INSERT INTO delivery_orders (name, email, phone, order_id, menu_item, quantity, total) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, email, phone, order_id, menuItem, quantity, total], (err) => {
    if (err) {
      console.error('Delivery insert error:', err);
      return res.status(500).json({ message: 'Error saving delivery order' });
    }
    res.json({ message: 'Delivery order saved' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
