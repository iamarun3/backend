require('dotenv').config();  // load .env

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'https://merry-gecko-a07f9a.netlify.app'
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL using .env config');
});

app.post('/api/dinein', (req, res) => {
  const { name, email, people, orderId, date } = req.body;
  const query = 'INSERT INTO dine_in_orders (name, email, people, order_id, reservation_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, people, orderId, date], (err) => {
    if (err) {
      console.error('Error saving dine-in order:', err);
      return res.status(500).send('Error saving dine-in order');
    }
    res.json({ message: 'Dine-in order saved' });
  });
});

app.post('/api/delivery', (req, res) => {
  const { name, email, phone, order_id, menuItem, quantity, total } = req.body;
  const query = 'INSERT INTO delivery_orders (name, email, phone, order_id, menu_item, quantity, total) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, email, phone, order_id, menuItem, quantity, total], (err) => {
    if (err) {
      console.error('Error saving delivery order:', err);
      return res.status(500).send('Error saving delivery order');
    }
    res.json({ message: 'Delivery order saved' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
