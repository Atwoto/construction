// Invoice Routes
const express = require('express');
const invoiceRouter = express.Router();

invoiceRouter.get('/', (req, res) => {
  res.json({ message: 'Invoice routes - Coming soon' });
});

module.exports = invoiceRouter;