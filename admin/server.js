const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, 'products.json');

app.use(express.static('public'));
app.use(express.json());

function loadProducts() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ products: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dataFile)).products;
}

function saveProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify({ products }, null, 2));
}

app.get('/products', (req, res) => {
  res.json({ products: loadProducts() });
});

app.post('/products', (req, res) => {
  const products = loadProducts();
  products.push(req.body);
  saveProducts(products);
  res.json({ success: true, products });
});

app.put('/products/:index', (req, res) => {
  const products = loadProducts();
  const idx = parseInt(req.params.index);
  if (products[idx]) {
    products[idx] = req.body;
    saveProducts(products);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/products/:index', (req, res) => {
  const products = loadProducts();
  products.splice(parseInt(req.params.index), 1);
  saveProducts(products);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
