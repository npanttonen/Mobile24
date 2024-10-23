const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB:n yhteystiedot
const mongoDBUrl = "mongodb+srv://niko22020:testitesti12345@dbdatabase.n3d11.mongodb.net/?retryWrites=true&w=majority&appName=DBDataBase";
const client = new MongoClient(mongoDBUrl);

//secret key
const SECRET_KEY = 'your_secret_key';

// Simuloitu käyttäjä tietokannassa
let users = [
    { id: 1, username: 'testuser', password: bcrypt.hashSync('password', 8) }
];

// Kirjautuminen
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Etsi käyttäjä
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).send('User not found.');

    // Tarkista salasana
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Invalid password.');

    // Luo JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // Tunnus voimassa 24 tuntia

    res.status(200).send({ auth: true, token });
};

// Datan käsittely
exports.postData = (req, res) => {
    const data = req.body.data;
    res.status(200).send({ message: `Data received by user ${req.userId}: ${data}` });
};
//kommentinpoistopyynto
exports.deleteComment = (req, res) => {
    const data = req.body._id;
    deleteCommentById(data);
    res.status(200).send({ message: `Data deleted by user ${req.userId}: ${data}` });
};
//postauksen ja sen kommenttien poisto
exports.deletePost = (req, res) => {
    const data = req.body._id;
    deletePostById(data);
    res.status(200).send({ message: `Data deleted by user ${req.userId}: ${data}` });
};
// Tunnuksen tarkistus middleware (JWT:n validointi)
exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.userId = decoded.id; // Tallenna käyttäjän ID seuraavia kutsuja varten
        next();
    });
};

//funktiot poistamiseen mongodb:stä
//posta kommentti
async function deleteCommentById(id) {
    console.log(id);
    try {
        await client.connect();
        console.log('Yhteys avattu');
  
        const db = client.db("test");
        const collection = db.collection('comments');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        console.log(`Poistettiin ${result.deletedCount} asiakirjaa`);
    } catch (error) {
        console.error('Virhe:', error);
    } finally {
        await client.close();
    }
  }
//poista postaus ja sen kommentit
async function deletePostById(id) {
    console.log(id);
    try {
        await client.connect();
        console.log('Yhteys avattu');
  
        const db = client.db("test");
        const collection = db.collection('posts');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        const collection2 = db.collection('comments');
        const result2 = await collection2.deleteMany({ ogpostid: (id) });
        //console.log(`Poistettiin ${result.deletedCount+result2.deletedCount} asiakirjaa`);
    } catch (error) {
        console.error('Virhe:', error);
    } finally {
        await client.close();
    }
  }
//demnstrointia varten
//hae postaukset
async function getGatecoriesToken(){
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
//demonstrointia varten
// kategorian hakemiseen reittiparametrin avulla
exports.getCategoriesWithToken = async (req, res) => {
    try {
        const results = await getGatecoriesToken();
        console.log(results);
        res.send(results);
    } catch (error) {
        console.error("Virhe kategorioiden hakemisessa:", error);
        res.status(500).send({ success: false, message: 'Virhe kategorioiden hakemisessa!' });
    }
  };