const mongoose = require('mongoose');
const Sweet = require('../models/Sweet');
require('dotenv').config();

describe('Sweet Shop Management - TDD Tests', () => {
  
  beforeAll(async () => {
    const testUri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;
    await mongoose.connect(testUri);
  }, 60000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000);

  beforeEach(async () => {
    await Sweet.deleteMany({});
  });


  describe('Sweet Creation and Validation', () => {
    test('should create a sweet with all required fields', async () => {
      const sweet = new Sweet({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 150,
        quantity: 100,
        description: 'Traditional Indian sweet',
        rating: 4.9
      });

      const saved = await sweet.save();
      
      expect(saved._id).toBeDefined();
      expect(saved.name).toBe('Gulab Jamun');
      expect(saved.price).toBe(150);
      expect(saved.quantity).toBe(100);
      expect(saved.inStock).toBe(true);
    });

    test('should fail when name is missing', async () => {
      const sweet = new Sweet({
        category: 'Traditional',
        price: 100,
        quantity: 50
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test('should fail when category is missing', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        price: 100,
        quantity: 50
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test('should fail when price is missing', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        category: 'Traditional',
        quantity: 50
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test('should not allow duplicate sweet names', async () => {
      const sweet1 = new Sweet({
        name: 'Duplicate Test',
        category: 'Traditional',
        price: 100,
        quantity: 50
      });
      await sweet1.save();

      const sweet2 = new Sweet({
        name: 'Duplicate Test',
        category: 'Cake',
        price: 200,
        quantity: 30
      });

      await expect(sweet2.save()).rejects.toThrow();
    });

    test('should use default rating of 4.5', async () => {
      const sweet = new Sweet({
        name: 'Default Rating Test',
        category: 'Traditional',
        price: 100,
        quantity: 50
      });

      const saved = await sweet.save();
      expect(saved.rating).toBe(4.5);
    });

    test('should use default imageUrl', async () => {
      const sweet = new Sweet({
        name: 'Default Image Test',
        category: 'Traditional',
        price: 100,
        quantity: 50
      });

      const saved = await sweet.save();
      expect(saved.imageUrl).toBe('https://via.placeholder.com/300');
    });
  });


  describe('Stock Management', () => {
    test('should mark sweet as in stock when quantity > 0', async () => {
      const sweet = new Sweet({
        name: 'In Stock Sweet',
        category: 'Traditional',
        price: 100,
        quantity: 10
      });

      const saved = await sweet.save();
      expect(saved.inStock).toBe(true);
    });

    test('should mark sweet as out of stock when quantity is 0', async () => {
      const sweet = new Sweet({
        name: 'Out of Stock Sweet',
        category: 'Traditional',
        price: 100,
        quantity: 0
      });

      const saved = await sweet.save();
      expect(saved.inStock).toBe(false);
    });

    test('should update inStock when quantity changes to 0', async () => {
      const sweet = new Sweet({
        name: 'Stock Change Test',
        category: 'Traditional',
        price: 100,
        quantity: 10
      });

      let saved = await sweet.save();
      expect(saved.inStock).toBe(true);

      saved.quantity = 0;
      saved = await saved.save();
      expect(saved.inStock).toBe(false);
    });

    test('should update inStock when restocking from 0', async () => {
      const sweet = new Sweet({
        name: 'Restock Test',
        category: 'Traditional',
        price: 100,
        quantity: 0
      });

      let saved = await sweet.save();
      expect(saved.inStock).toBe(false);

      saved.quantity = 50;
      saved = await saved.save();
      expect(saved.inStock).toBe(true);
    });
  });

  describe('Purchase Operations', () => {
    test('should decrease quantity when purchasing', async () => {
      const sweet = new Sweet({
        name: 'Purchase Test',
        category: 'Traditional',
        price: 100,
        quantity: 100
      });

      const saved = await sweet.save();
      
      saved.quantity -= 5;
      const updated = await saved.save();

      expect(updated.quantity).toBe(95);
      expect(updated.inStock).toBe(true);
    });

    test('should mark as out of stock after purchasing all', async () => {
      const sweet = new Sweet({
        name: 'Sold Out Test',
        category: 'Traditional',
        price: 100,
        quantity: 5
      });

      const saved = await sweet.save();
      
      saved.quantity = 0;
      const updated = await saved.save();

      expect(updated.quantity).toBe(0);
      expect(updated.inStock).toBe(false);
    });
  });

  describe('Search and Filter Operations', () => {
    beforeEach(async () => {
      await Sweet.insertMany([
        {
          name: 'Chocolate Truffle',
          category: 'Chocolate',
          price: 299,
          quantity: 50,
          rating: 4.8
        },
        {
          name: 'Gulab Jamun',
          category: 'Traditional',
          price: 150,
          quantity: 100,
          rating: 4.9
        },
        {
          name: 'Rasgulla',
          category: 'Traditional',
          price: 120,
          quantity: 80,
          rating: 4.8
        },
        {
          name: 'Vanilla Cupcake',
          category: 'Cake',
          price: 180,
          quantity: 40,
          rating: 4.5
        }
      ]);
    });

    test('should find sweets by name', async () => {
      const sweets = await Sweet.find({ name: /Gulab/i });
      
      expect(sweets.length).toBe(1);
      expect(sweets[0].name).toBe('Gulab Jamun');
    });

    test('should find sweets by category', async () => {
      const sweets = await Sweet.find({ category: 'Traditional' });
      
      expect(sweets.length).toBe(2);
      expect(sweets.every(s => s.category === 'Traditional')).toBe(true);
    });

    test('should find sweets by price range', async () => {
      const sweets = await Sweet.find({
        price: { $gte: 100, $lte: 200 }
      });
      
      expect(sweets.length).toBe(3);
      sweets.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(100);
        expect(sweet.price).toBeLessThanOrEqual(200);
      });
    });

    test('should find sweets with high ratings', async () => {
      const sweets = await Sweet.find({ rating: { $gte: 4.8 } });
      
      expect(sweets.length).toBe(3);
    });

    test('should return all sweets when no filter', async () => {
      const sweets = await Sweet.find({});
      
      expect(sweets.length).toBe(4);
    });
  });

  describe('Update Operations', () => {
    test('should update sweet price', async () => {
      const sweet = new Sweet({
        name: 'Update Test',
        category: 'Traditional',
        price: 100,
        quantity: 10
      });

      let saved = await sweet.save();
      
      saved.price = 150;
      const updated = await saved.save();

      expect(updated.price).toBe(150);
    });

    test('should update sweet quantity', async () => {
      const sweet = new Sweet({
        name: 'Quantity Update',
        category: 'Traditional',
        price: 100,
        quantity: 10
      });

      const saved = await sweet.save();
      const id = saved._id;
      
      await Sweet.findByIdAndUpdate(id, { quantity: 50 });
      const updated = await Sweet.findById(id);

      expect(updated.quantity).toBe(50);
    });
  });

  describe('Delete Operations', () => {
    test('should delete a sweet', async () => {
      const sweet = new Sweet({
        name: 'Delete Test',
        category: 'Traditional',
        price: 100,
        quantity: 10
      });

      const saved = await sweet.save();
      await Sweet.findByIdAndDelete(saved._id);

      const found = await Sweet.findById(saved._id);
      expect(found).toBeNull();
    });

    test('should delete multiple sweets by category', async () => {
      await Sweet.insertMany([
        { name: 'Sweet 1', category: 'ToDelete', price: 100, quantity: 10 },
        { name: 'Sweet 2', category: 'ToDelete', price: 100, quantity: 10 },
        { name: 'Sweet 3', category: 'Keep', price: 100, quantity: 10 }
      ]);

      await Sweet.deleteMany({ category: 'ToDelete' });

      const remaining = await Sweet.find({});
      expect(remaining.length).toBe(1);
      expect(remaining[0].category).toBe('Keep');
    });
  });
});