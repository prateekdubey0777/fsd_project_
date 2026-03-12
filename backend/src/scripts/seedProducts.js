const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('../models/Product');

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');

  await mongoose.connect(uri);

  const products = [
    {
      name: 'SHOPEZ Classic T-Shirt',
      description: '100% cotton, regular fit. Perfect for everyday wear.',
      price: 499,
      category: 'Fashion',
      images: ['https://picsum.photos/seed/shopez-tshirt/1200/800'],
      stock: 50,
      isActive: true,
    },
    {
      name: 'Wireless Earbuds Pro',
      description: 'Noise isolation, long battery life, fast charging case.',
      price: 1999,
      category: 'Electronics',
      images: ['https://picsum.photos/seed/shopez-earbuds/1200/800'],
      stock: 35,
      isActive: true,
    },
    {
      name: 'Stainless Steel Water Bottle (1L)',
      description: 'Insulated bottle to keep drinks hot/cold for hours.',
      price: 699,
      category: 'Home & Kitchen',
      images: ['https://picsum.photos/seed/shopez-bottle/1200/800'],
      stock: 80,
      isActive: true,
    },
    {
      name: 'Minimal Backpack',
      description: 'Laptop-friendly backpack with multiple compartments.',
      price: 1299,
      category: 'Accessories',
      images: ['https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=1200&q=60'],
      stock: 40,
      isActive: true,
    },
    {
      name: 'Notebook Set (Pack of 3)',
      description: 'A5 notebooks, dotted pages, premium paper.',
      price: 299,
      category: 'Stationery',
      images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60'],
      stock: 120,
      isActive: true,
    },
    {
      name: 'Smart LED Bulb',
      description: 'App controlled, warm/cool modes, energy efficient.',
      price: 599,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=1200&q=60'],
      stock: 60,
      isActive: true,
    },
  ];

  const created = await Product.insertMany(products);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${created.length} products`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
