const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//MongoDB Config

const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const uri = "mongodb+srv://mern-book-store:UdKhT7ZD8rZgHT7@cluster0.zlkb7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //Create a collection of document
    const bookCollection = client.db("bookInventory").collection("books");

    //Insert a book to the db :post method 
    // -> untuk memasukkan data
    app.post("/upload-book",async(req,res)=>{
      const data = req.body;
      const result = await bookCollection.insertOne(data);
      res.send(result);
    })

    //get all books from the db : get method
    // -> untuk mengambil data
    // app.get("/all-books",async(req,res)=>{
    //   const books = bookCollection.find({});
    //   const result = await books.toArray();
    //   res.send(result);
    // })

    //update a book in the db : patch method
    // -> untuk mengubah data
    app.patch("/book/:id",async(req,res)=>{
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...updateBookData}
      };

      //update the book
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //delete a book from the db : delete method
    // -> untuk menghapus data

    app.delete("/book/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    })

    //find by category
    //-> untuk mencari data berdasarkan kategori
    
    app.get("/all-books",async(req,res)=>{
      let query = {};
      if(req.query.category){
        query = {category:req.query.category};
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})