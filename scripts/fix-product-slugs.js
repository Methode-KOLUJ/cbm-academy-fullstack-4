const mongoose = require('mongoose');
const dbConnect = require('../lib/db').default || require('../lib/db');
const Product = require('../models/Product').default || require('../models/Product');

const slugify = (s) => s
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

async function generateUniqueSlug(base) {
  let baseSlug = slugify(base) || `product-${Date.now()}`;
  let slug = baseSlug;
  let i = 0;
  while (await Product.findOne({ slug })) {
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
  return slug;
}

async function run() {
  try {
    await dbConnect();
    console.log('Connected');
    const products = await Product.find({ $or: [ { slug: { $exists: false }}, { slug: null }, { slug: '' } ] });
    console.log(`Found ${products.length} products needing slug generation`);
    for (const p of products) {
      const slug = await generateUniqueSlug(p.title || `product-${p._id}`);
      p.slug = slug;
      await p.save();
      console.log(`Updated product ${p._id} slug -> ${slug}`);
    }
    console.log('All done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
