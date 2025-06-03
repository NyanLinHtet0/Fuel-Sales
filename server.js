const express = require('express')
const path = require('path');
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(express.json());   

const uri = "mongodb+srv://nyanlinhtet:D3menter!@custermain.iddklp5.mongodb.net/?retryWrites=true&w=majority&appName=Custermain";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}});

async function fetch_data() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const db = client.db("fuel_database");            // choose (or create) your database
      const sales = db.collection("fuel_sales");           // choose (or create) your collection
      const allsales = await sales.find({}).toArray();
      return allsales;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function udpate_database(dataArray){
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const db = client.db("fuel_database");            // choose (or create) your database
      const sales = db.collection("fuel_sales");           // choose (or create) your collection
      if (Array.isArray(dataArray) && dataArray.length && typeof dataArray[0] === "object") {
        const result = await sales.insertMany(dataArray);
        console.log(`${result.insertedCount} documents added`);
      }

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}



fetch_data().catch(console.dir);

app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'))
})

app.get('/api/fuel-sales', async (req, res) => {
  try {
    const rows = await fetch_data();          // <‑‑ calls the function
    res.json(rows);                           // send to browser
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fuel-sales', async (req, res) => {
  try {
    await udpate_database(req.body);        // req.body should be your array
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



