/**
 * seed.js
 * Database seeder for the Store Rating Platform.
 *
 * Run with: npm run seed
 *
 * Seeds:
 * - 1 admin user
 * - 3 store owners
 * - 5 regular users
 * - 3 stores (each assigned to a store owner)
 * - Sample ratings from users to stores
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const SALT_ROUNDS = 10;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const adminUser = {
  name: 'System Administrator',
  email: 'admin@storerate.com',
  password: 'Admin@123',
  address: '123 Admin Street, City, Country',
  role: 'ADMIN',
};

const storeOwners = [
  {
    name: 'Store Owner One Vibrant',
    email: 'owner1@storerate.com',
    password: 'Owner1@Pass',
    address: '10 Commerce Lane, Business District, Mumbai',
    role: 'STORE_OWNER',
  },
  {
    name: 'Store Owner Two Vibrant',
    email: 'owner2@storerate.com',
    password: 'Owner2@Pass',
    address: '22 Market Street, Trade Zone, Pune',
    role: 'STORE_OWNER',
  },
  {
    name: 'Store Owner Three Vibrant',
    email: 'owner3@storerate.com',
    password: 'Owner3@Pass',
    address: '5 Enterprise Road, Tech Park, Bangalore',
    role: 'STORE_OWNER',
  },
];

const regularUsers = [
  {
    name: 'Regular User Alpha Test',
    email: 'user.alpha@storerate.com',
    password: 'Alpha@1234',
    address: '1 Elm Street, Residential Area, Delhi',
    role: 'USER',
  },
  {
    name: 'Regular User Beta Sample',
    email: 'user.beta@storerate.com',
    password: 'Beta@1234',
    address: '9 Maple Avenue, Green Colony, Chennai',
    role: 'USER',
  },
  {
    name: 'Regular User Gamma Prime',
    email: 'user.gamma@storerate.com',
    password: 'Gamma@1234',
    address: '44 Pine Boulevard, River View, Kolkata',
    role: 'USER',
  },
  {
    name: 'Regular User Delta Testing',
    email: 'user.delta@storerate.com',
    password: 'Delta@1234',
    address: '67 Oak Close, Hilltop Area, Hyderabad',
    role: 'USER',
  },
  {
    name: 'Regular User Epsilon Vibrant',
    email: 'user.epsilon@storerate.com',
    password: 'Epsilon@1',
    address: '88 Birch Way, South Zone, Jaipur',
    role: 'USER',
  },
];

const stores = [
  {
    name: 'Vibrant Electronics Superstore',
    email: 'electronics@vibrant.com',
    address: '10 Commerce Lane, Business District, Mumbai',
    ownerIndex: 0, // maps to storeOwners[0]
  },
  {
    name: 'Vibrant Fresh Grocery Market',
    email: 'grocery@vibrant.com',
    address: '22 Market Street, Trade Zone, Pune',
    ownerIndex: 1,
  },
  {
    name: 'Vibrant Fashion Lifestyle Store',
    email: 'fashion@vibrant.com',
    address: '5 Enterprise Road, Tech Park, Bangalore',
    ownerIndex: 2,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function insertUser(conn, user) {
  const hashed = await hashPassword(user.password);
  const [result] = await conn.execute(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, hashed, user.address, user.role]
  );
  console.log(`  ✅ Inserted ${user.role}: ${user.name} (id=${result.insertId})`);
  return result.insertId;
}

// ─── Main Seeder ──────────────────────────────────────────────────────────────

async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('\n🌱  Starting database seeder...\n');

    // Clear existing data in correct order (respect FK constraints)
    console.log('🗑️   Clearing existing seed data...');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await conn.execute('TRUNCATE TABLE ratings');
    await conn.execute('TRUNCATE TABLE stores');
    await conn.execute('TRUNCATE TABLE users');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('  ✅ Tables cleared.\n');

    // ── Insert Admin ────────────────────────────────────────────────────────
    console.log('👤  Inserting admin user...');
    await insertUser(conn, adminUser);
    console.log();

    // ── Insert Store Owners ─────────────────────────────────────────────────
    console.log('🏪  Inserting store owners...');
    const ownerIds = [];
    for (const owner of storeOwners) {
      const id = await insertUser(conn, owner);
      ownerIds.push(id);
    }
    console.log();

    // ── Insert Regular Users ────────────────────────────────────────────────
    console.log('👥  Inserting regular users...');
    const userIds = [];
    for (const user of regularUsers) {
      const id = await insertUser(conn, user);
      userIds.push(id);
    }
    console.log();

    // ── Insert Stores ───────────────────────────────────────────────────────
    console.log('🏬  Inserting stores...');
    const storeIds = [];
    for (const store of stores) {
      const owner_id = ownerIds[store.ownerIndex];
      const [result] = await conn.execute(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [store.name, store.email, store.address, owner_id]
      );
      const storeId = result.insertId;
      storeIds.push(storeId);
      console.log(`  ✅ Inserted store: "${store.name}" (id=${storeId}, owner_id=${owner_id})`);
    }
    console.log();

    // ── Insert Ratings ──────────────────────────────────────────────────────
    console.log('⭐  Inserting ratings...');

    const ratingsData = [
      // user[0] rates store[0]=4, store[1]=5, store[2]=3
      { user_id: userIds[0], store_id: storeIds[0], rating: 4 },
      { user_id: userIds[0], store_id: storeIds[1], rating: 5 },
      { user_id: userIds[0], store_id: storeIds[2], rating: 3 },

      // user[1] rates store[0]=5, store[1]=4
      { user_id: userIds[1], store_id: storeIds[0], rating: 5 },
      { user_id: userIds[1], store_id: storeIds[1], rating: 4 },

      // user[2] rates store[0]=3, store[2]=5
      { user_id: userIds[2], store_id: storeIds[0], rating: 3 },
      { user_id: userIds[2], store_id: storeIds[2], rating: 5 },

      // user[3] rates store[1]=3, store[2]=4
      { user_id: userIds[3], store_id: storeIds[1], rating: 3 },
      { user_id: userIds[3], store_id: storeIds[2], rating: 4 },

      // user[4] rates store[0]=4, store[1]=2, store[2]=5
      { user_id: userIds[4], store_id: storeIds[0], rating: 4 },
      { user_id: userIds[4], store_id: storeIds[1], rating: 2 },
      { user_id: userIds[4], store_id: storeIds[2], rating: 5 },
    ];

    for (const r of ratingsData) {
      const [result] = await conn.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [r.user_id, r.store_id, r.rating]
      );
      console.log(
        `  ✅ Rating inserted: user_id=${r.user_id} → store_id=${r.store_id}, rating=${r.rating} (id=${result.insertId})`
      );
    }
    console.log();

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log('─────────────────────────────────────────────────────────');
    console.log('✅  Seeding completed successfully!');
    console.log('');
    console.log('📋  Seeded Summary:');
    console.log(`    • 1 Admin    → email: ${adminUser.email} / password: ${adminUser.password}`);
    storeOwners.forEach((o, i) => {
      console.log(`    • Store Owner ${i + 1} → email: ${o.email} / password: ${o.password}`);
    });
    regularUsers.forEach((u, i) => {
      console.log(`    • User ${i + 1}       → email: ${u.email} / password: ${u.password}`);
    });
    console.log(`    • ${stores.length} Stores`);
    console.log(`    • ${ratingsData.length} Ratings`);
    console.log('─────────────────────────────────────────────────────────\n');

    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('\n❌  Seeding failed:', err.message);
    if (conn) conn.release();
    process.exit(1);
  }
}

seed();
