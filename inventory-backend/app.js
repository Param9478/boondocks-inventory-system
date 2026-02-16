const express = require('express');
const mongoose = require('mongoose'); // 1. Ehnu uncomment karo, bina ehde DB connect nahi hona
const cors = require('cors'); // 2. React naal connect karan lai eh chahida
const Item = require('./models/Item');

const app = express();
app.use(express.json());
app.use(cors()); // CORS enable karo

// 3. Database Connection (URI apni replace karo)
const URI =
  'mongodb+srv://param9478:Canada123@cluster0.alolvbv.mongodb.net/?appName=Cluster0';

mongoose
  .connect(URI)
  .then(() => console.log('✅ Database Connected!'))
  .catch((err) => console.log('❌ DB Error:', err));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Boondocks Inventory</h1>');
});

// 4. GET Items (YAD RAKHO: Item.find() use karna hai)
app.get('/api/items', async (req, res) => {
  try {
    const allItems = await Item.find(); // DB vichon saara stock mangvaya
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/items',async(req,res)=>{
  
})

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
