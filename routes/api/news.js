const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post(
  '/',
  // Name and pass the second parameter as a custom error message
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { type, country } = req.body;
    //type : health
    //country: pakistan
    try {
      fetch(`https://newsapi.org/v2/everything?q=${type}+${country}&apiKey=2a572fcf4ab44cf39bcddbb679564cbb`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data =>  res.json( data ))
        .catch(error => console.error(`There has been a problem with your fetch operation: ${error.message}`));


    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');rs
    }
  }
);

module.exports = router; 