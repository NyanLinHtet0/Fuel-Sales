const express = require('express')
const path = require('path');
const app = express()
const port = 3001
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://nyanlinhtet:D3menter!@custermain.iddklp5.mongodb.net/?retryWrites=true&w=majority&appName=Custermain";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}});

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const db = client.db("sample_mflix");            // choose (or create) your database
      const users = db.collection("comments");           // choose (or create) your collection
      const allUsers = await users.find({}).toArray();
      console.log("All users:", allUsers);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}



run().catch(console.dir);

app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'))
  })
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



