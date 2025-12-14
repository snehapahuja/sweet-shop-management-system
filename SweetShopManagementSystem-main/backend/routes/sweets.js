const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' }; 
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }
    
    if (sweet.quantity < 1) {
      return res.status(400).json({ msg: 'Out of stock' });
    }
    
    sweet.quantity -= 1;
    sweet.inStock = sweet.quantity > 0;
    await sweet.save();
    
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }
    
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }
    
    res.json({ msg: 'Sweet deleted', sweet });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.post('/:id/restock', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }
    
    sweet.quantity += Number(quantity);
    sweet.inStock = sweet.quantity > 0;
    await sweet.save();
    
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;