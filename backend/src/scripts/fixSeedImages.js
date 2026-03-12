const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('../models/Product');

dotenv.config();

const fixes = [
  {
    name: 'SHOPEZ Classic T-Shirt',
    images: ['https://picsum.photos/seed/shopez-tshirt/1200/800'],
  },
  {
    name: 'Wireless Earbuds Pro',
    images: ['https://picsum.photos/seed/shopez-earbuds/1200/800'],
  },
  {
    name: 'Stainless Steel Water Bottle (1L)',
    images: ['https://picsum.photos/seed/shopez-bottle/1200/800'],
  },
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');

  await mongoose.connect(uri);

  let updatedCount = 0;
  for (const f of fixes) {
    const res = await Product.updateMany({ name: f.name }, { $set: { images: f.images } });
    updatedCount += res.modifiedCount || 0;
  }

  // eslint-disable-next-line no-console
  console.log(`Updated images for ${updatedCount} products`);

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
