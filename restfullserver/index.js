const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;
const authController = require('./authController');

// MongoDB:n yhteystiedot
const mongoDBUrl = "mongodb+srv://niko22020:testitesti12345@dbdatabase.n3d11.mongodb.net/?retryWrites=true&w=majority&appName=DBDataBase";
const client = new MongoClient(mongoDBUrl);

// Middleware JSON-kehon käsittelemiseksi
app.use(express.json());

//funktio aikaleiman tekemiseksi iso8601 muodossa
function generateIso8601Timestamp() {
  return new Date().toISOString();
}

//mongodb functiot
// Funktio MongoDB-yhteyden muodostamiseksi
async function connectToMongoDB() {
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("sample_mflix"); // Vaihda oma tietokanta
        const collection = database.collection("users"); // Vaihda oma kokoelma

        // Testataan tietokantakyselyä
        const results = await collection.find({}).toArray();
        console.log("Testataan tietokantakyselyä:", results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }
}
//hae postaukset
async function getGatecories(){
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("test");
        const collection = database.collection("categories");

        // Testataan tietokantakyselyä
        const results = await collection.find({}).toArray();
        //console.log("Testataan tietokantakyselyä:", results);
        return(results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }

}
//hae postaukset
async function getAllPosts(){
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("test"); // Vaihda oma tietokanta
        const collection = database.collection("posts"); // Vaihda oma kokoelma

        // Testataan tietokantakyselyä
        const results = await collection.find({}).toArray();
        //console.log("Testataan tietokantakyselyä:", results);
        return(results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }

}
//get categoryposts
async function getCategoryPosts(id){
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("test"); // Vaihda oma tietokanta
        const collection = database.collection("posts"); // Vaihda oma kokoelma
        console.log(typeof id);
        const query = { categoryID: id };
        console.log(query);
        const results = await collection.find(query).toArray();
        //console.log("Testataan tietokantakyselyä:", results);
        return(results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }

}
//viestin lisäys
async function sendPost(message, category) {
  try {
      await client.connect();
      const database = client.db("test"); // Vaihda tietokanta
      const collection = database.collection("posts"); // Vaihda kokoelma

      // Lisää uusi postaus tietokantaan
      const timeStamp = generateIso8601Timestamp();
      console.log(timeStamp);
      const result = await collection.insertOne({ "time" : timeStamp, "post" : message , "categoryID" : category});
      console.log("Tuote lisätty:", result.insertedId);
      return result;
  } catch (error) {
      console.error("Virhe tuotteen lisäämisessä:", error);
      throw error; // Heitä virhe edelleen käsiteltäväksi
  } finally {
      await client.close(); // Sulje yhteys
  }
}

//kommentin lisäys
async function sendComment(message, ogpostid) {
  try {
      await client.connect();
      const database = client.db("test"); // Vaihda tietokanta
      const collection = database.collection("comments"); // Vaihda kokoelma

      // Lisää uusi postaus tietokantaan
      const timeStamp = generateIso8601Timestamp();
      console.log(timeStamp);
      const result = await collection.insertOne({ "time" : timeStamp, "ogpostid" : ogpostid, "post" : message });
      console.log("Tuote lisätty:", result.insertedId);
      return result;
  } catch (error) {
      console.error("Virhe tuotteen lisäämisessä:", error);
      throw error; // Heitä virhe edelleen käsiteltäväksi
  } finally {
      await client.close(); // Sulje yhteys
  }
}
async function getallpostcomments(id) {
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("test"); // Vaihda oma tietokanta
        const collection = database.collection("comments"); // Vaihda oma kokoelma
        console.log(typeof id);
        const query = { ogpostid: id };
        console.log(query);
        const results = await collection.find(query).toArray();
        //console.log("Testataan tietokantakyselyä:", results);
        return(results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }
}
//hae yksi postaus
async function getpost(id) {
    try {
        // Yhdistä MongoDB:hen
        await client.connect();
        console.log("Yhdistetty MongoDB:hen");

        // Valitse tietokanta ja kokoelma
        const database = client.db("test"); // Vaihda oma tietokanta
        const collection = database.collection("posts"); // Vaihda oma kokoelma
        console.log(typeof id);
        const query = { _id: new ObjectId(id) };
        const results = await collection.find({ _id: new ObjectId(id) }).toArray();
        //console.log("Testataan tietokantakyselyä:", results);
        return(results);
    } catch (err) {
        console.error("Virhe yhteydessä MongoDB:hen:", err);
    }
}
//restful funktiot
// POST-pyyntö viestin vastaanottamiseksi
app.post('addpost', (req, res) => {
    console.log(req.body);
    const { message } = req.body;
    const { categoryID } = req.body;

    if (message) {
        console.log("Vastaanotettu viesti:", message);
        res.status(200).send({ success: true, message: 'Viesti vastaanotettu ja tulostettu!' });
        sendPost(message, categoryID);
    } else {
        console.log(message)
        res.status(400).send({ success: false, message: 'Viesti puuttuu!' });
    }
});
//kommentin lähetys
app.post('/addcomment', (req, res) => {
  console.log(req.body);
  const { message } = req.body;
  //ogpostid kommentti yhditetään alkuperäiseen postaukseen
  const { ogpostid } = req.body;
  if (message && ogpostid) {
      console.log("kommentti viesti:", message, "ogpostid:", ogpostid);
      res.status(200).send({ success: true, message: 'Kommentti vastaanotettu ja tulostettu!' });
      sendComment(message, ogpostid);
  } else {
      console.log(message)
      res.status(400).send({ success: false, message: 'Kommentti puuttuu!' });
  }
});
//get-pyyntö postausten hakemiseen
app.get('/getposts', async (req, res) => {
  try {
      const results = await getAllPosts();
      console.log(results);
      res.send(results);
  } catch (error) {
      console.error("Virhe postien hakemisessa:", error);
      res.status(500).send({ success: false, message: 'Virhe postien hakemisessa!' });
  }
});
//get-pyyntö kategorioiden hakemiseen
app.get('/getcategories', async (req, res) => {
    try {
        const results = await getGatecories();
        console.log(results);
        res.send(results);
    } catch (error) {
        console.error("Virhe kategorioiden hakemisessa:", error);
        res.status(500).send({ success: false, message: 'Virhe kategorioiden hakemisessa!' });
    }
  });
// kategorian hakemiseen reittiparametrin avulla
app.get('/getcategoryposts/:id', async (req, res) => {
    const categoryId = req.params.id; // Hae ID URL:stä
    const respond = await getCategoryPosts(categoryId);
    res.send(respond);

});
//kaikki kommentit
app.get('/getallpostcomments/:id', async (req, res) => {
    const postID = req.params.id;
    const respond = await getallpostcomments(postID);
    res.send (respond);
});
//yksi postaus
app.get('/getpost/:id', async (req, res) => {
    const postID = req.params.id;
    const respond = await getpost(postID);
    res.send (respond);
});
//login ja hae autentitikointi
app.post('/login', authController.login);
app.post('/data', authController.verifyToken, authController.postData);
//kommentinpoisto
app.delete('/deleteComment', authController.verifyToken, authController.deleteComment);
app.delete('/deletepost', authController.verifyToken, authController.deletePost);
// GET-pyyntö testisivulle
app.get('/', (req, res) => {
    res.send('Tervetuloa Node.js-sovellukseen!');
});
//demoa varten
app.get('/getcategoriesWithToken', authController.verifyToken, authController.getCategoriesWithToken);
// GET-pyyntö testisivulle
app.get('/testpost', (req, res) => {
  //sendPost();
  res.send('Tervetuloa Node.js-sovellukseen!');
});

// Käynnistetään palvelin
app.listen(port, () => {
    console.log(`Sovellus kuuntelee osoitteessa http://localhost:${port}`);
});

// Yhdistä MongoDB:hen ja testaa tietokantakysely
connectToMongoDB().catch(console.error);
