const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Allows your frontend HTML file to connect safely

const app = express();
app.use(express.json()); // Allows our backend to read JSON data sent from a frontend
app.use(cors());         // Enables cross-origin requests for your frontend practice files

// 1. Connect to your database (Uses Cloud Database on Render, falls back to MAMP locally)
const db = mysql.createConnection(
  process.env.DATABASE_URL || {
    host: '127.0.0.1',
    port: 3307,        // Matches your MAMP port perfectly
    user: 'root',
    password: 'root',
    database: 'my_project_db' 
  }
);

// Connect to MySQL and automatically set up all tables
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to the database!');

  // TABLE 1: Users Table SQL
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // TABLE 2: Products Table SQL
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      stock INT DEFAULT 0
    );
  `;

  // TABLE 3: Tasks Table SQL (For your full-stack practice app)
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Execute Table 1 Creation
  db.query(createUsersTable, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('✅ Users table is ready!');
  });

  // Execute Table 2 Creation
  db.query(createProductsTable, (err) => {
    if (err) console.error('Error creating products table:', err);
    else console.log('✅ Products table is ready!');
  });

  // Execute Table 3 Creation
  db.query(createTasksTable, (err) => {
    if (err) console.error('Error creating tasks table:', err);
    else console.log('✅ Tasks table is ready!');
  });
});

// ==========================================
// 2. USERS ROUTES (Insert & Fetch)
// ==========================================

// INSERT a new user
app.post('/api/users', (req, res) => {
  const { username, email } = req.body; 
  const sqlQuery = 'INSERT INTO users (username, email) VALUES (?, ?)';

  db.query(sqlQuery, [username, email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database insertion failed' });
    }
    res.status(201).json({ message: 'User added successfully!', userId: result.insertId });
  });
});

// FETCH all users
app.get('/api/users', (req, res) => {
  const sqlQuery = 'SELECT * FROM users';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database fetch failed' });
    }
    res.json(results); 
  });
});

// ==========================================
// 3. PRODUCTS ROUTES (Insert & Fetch)
// ==========================================

// INSERT a new product
app.post('/api/products', (req, res) => {
  const { product_name, price, stock } = req.body;
  const sqlQuery = 'INSERT INTO products (product_name, price, stock) VALUES (?, ?, ?)';

  db.query(sqlQuery, [product_name, price, stock], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database insertion failed' });
    }
    res.status(201).json({ message: 'Product added successfully!', productId: result.insertId });
  });
});

// FETCH all products
app.get('/api/products', (req, res) => {
  const sqlQuery = 'SELECT * FROM products';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database fetch failed' });
    }
    res.json(results);
  });
});

// ==========================================
// 4. TASKS ROUTES (For To-Do App Practice)
// ==========================================

// FETCH all tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// INSERT a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, title, status: 'Pending' });
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task deleted successfully' });
  });
});

// Dynamic Port Assignment for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});