const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // in-memory DB for testing

// Create artwork table
db.serialize(() => {
  db.run(`CREATE TABLE artwork (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    price REAL
  )`);

  // Insert sample data
  db.run(`INSERT INTO artwork (title, description, tags, price) VALUES
    ('Dark Dreams', 'Abstract dark painting', 'abstract,dark', 100),
    ('Ocean Light', 'Bright blue ocean art', 'ocean,blue', 150),
    ('Sunny Fields', 'Yellow fields with sunshine', 'sun,fields', 200)
  `);
});

module.exports = db;