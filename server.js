const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder (e.g. index.html, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Arun@2006',
  database: 'foodie_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Dine-In Order Endpoint
app.post('/api/dinein', (req, res) => {
  const { name, email, people, orderId, date } = req.body;
  const query = 'INSERT INTO dine_in_orders (name, email, people, order_id, reservation_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, people, orderId, date], (err) => {
    if (err) return res.status(500).send('Error saving dine-in order');
    res.json({ message: 'Dine-in order saved' }); // ✅ Send JSON
  });
});


// Delivery Order Endpoint
app.post('/api/delivery', (req, res) => {
 const { name, email, phone, order_id, menuItem, quantity, total } = req.body;
const query = 'INSERT INTO delivery_orders (name, email, phone, order_id, menu_item, quantity, total) VALUES (?, ?, ?, ?, ?, ?, ?)';
db.query(query, [name, email, phone, order_id, menuItem, quantity, total], (err) => {
  if (err) return res.status(500).send('Error saving delivery order');
  res.send('Delivery order saved');
});
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
