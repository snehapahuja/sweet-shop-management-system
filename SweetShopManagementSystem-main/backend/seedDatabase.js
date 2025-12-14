require('dotenv').config();
const mongoose = require('mongoose');


const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  description: String,
  imageUrl: { type: String, default: 'https://via.placeholder.com/300' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 }, 
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sweetSchema.pre('save', function(next) {
  this.inStock = this.quantity > 0;
  this.updatedAt = Date.now();
  next();
});

const Sweet = mongoose.model('Sweet', sweetSchema);


const sweetData = [
  {
    name: 'Chocolate Truffle',
    category: 'Chocolate',
    price: 299,
    quantity: 50,
    description: 'Rich dark chocolate truffle with cocoa powder coating',
    imageUrl:'https://www.fnp.com/images/pr/l/v20250519212917/chocolate-truffle-cream-cake_1.jpg',
    rating: 4.8
  },
  {
    name: 'Strawberry Delight',
    category: 'Cake',
    price: 449,
    quantity: 25,
    description: 'Fresh strawberry cake with cream frosting',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    rating: 4.7
  },
  {
    name: 'Gulab Jamun',
    category: 'Traditional',
    price: 150,
    quantity: 100,
    description: 'Traditional Indian sweet soaked in sugar syrup',
    imageUrl: 'https://png.pngtree.com/png-clipart/20230508/original/pngtree-indian-sweet-gulab-jamun-closeup-view-png-image_9151773.png',
    rating: 4.9
  },
  {
    name: 'Chocolate Chip Cookie',
    category: 'Cookie',
    price: 199,
    quantity: 75,
    description: 'Crispy cookies loaded with chocolate chips',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    rating: 4.6
  },
  {
    name: 'Vanilla Cupcake',
    category: 'Cake',
    price: 180,
    quantity: 40,
    description: 'Fluffy vanilla cupcake with buttercream frosting',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=400&fit=crop',
    rating: 4.5
  },
  {
    name: 'Rasgulla',
    category: 'Traditional',
    price: 120,
    quantity: 80,
    description: 'Spongy cottage cheese balls in light sugar syrup',
    imageUrl: 'https://png.pngtree.com/png-vector/20250207/ourmid/pngtree-delightful-bowl-of-soft-rasgullas-garnished-with-fresh-herbs-png-image_15419513.png',
    rating: 4.8
  },
  {
    name: 'Ladoo',
    category: 'Traditional',
    price: 80,
    quantity: 120,
    description: 'Sweet round balls made from gram flour',
    imageUrl: 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-diwali-besan-ladoo-png-image_10234536.png',
    rating: 4.7
  },
  {
    name: 'Jalebi',
    category: 'Traditional',
    price: 100,
    quantity: 60,
    description: 'Crispy sweet spirals soaked in sugar syrup',
    imageUrl: 'https://media.istockphoto.com/id/1159362325/photo/bread-pakora.jpg?s=612x612&w=0&k=20&c=93uILcInCMXroXgjEJYXNeUzWh5NASSrEnylAgW7hcs=',
    rating: 4.6
  },
  {
    name: 'Kaju Katli',
    category: 'Traditional',
    price: 350,
    quantity: 45,
    description: 'Diamond-shaped cashew fudge with silver leaf',
    imageUrl: 'https://www.shutterstock.com/image-vector/kaju-katli-flower-pattern-traditional-260nw-2650237369.jpg',
    rating: 4.9
  },
  {
    name: 'Barfi',
    category: 'Traditional',
    price: 180,
    quantity: 90,
    description: 'Milk-based sweet confection with various flavors',
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/060/240/517/non_2x/indian-sweet-burfi-in-bowl-on-transparent-background-png.png',
    rating: 4.7
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop');

    await Sweet.deleteMany({});

    const sweets = await Sweet.insertMany(sweetData);

    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

seedDatabase();