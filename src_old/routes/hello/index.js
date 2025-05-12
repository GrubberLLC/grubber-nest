// filepath: /Users/ennismachta/Grubber-Server/hello.js
const express = require('express');
const router = express.Router();

router.post('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World ENNINS!' });
});

module.exports = router;