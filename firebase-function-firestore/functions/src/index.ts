import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";


admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(express.json());
//will add auth on top later

app.post("setText", async (req, res) => {
    const { text } = req.body;
    const db = admin.firestore();
    const doc = await db.collection("text").add({ text });
    res.status(200).send({ id: doc.id });
});


app.get("getAllText", async (req, res) => {
    const db = admin.firestore();
    const snapshot = await db.collection("text").get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.status(200).send(data);
});

app.get("getText/:id", async (req, res) => {
    const { id } = req.params;
    const db = admin.firestore();
    const doc = await db.collection("text").doc(id).get();
    const data = doc.data();
    res.status(200).send(data);
});

app.put("updateText/:id", async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const db = admin.firestore();
    await db.collection("text").doc(id).update({ text });
    res.status(200).send({ id });
});

//can i make webhooks in express?-> yes
app.post("webhook", async (req, res) => {
    //send top text to webhook
    const db = admin.firestore();
    const snapshot = await db.collection("text").get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.status(200).send(data);
});


// Expose Express API as a single Cloud Function:
export const api = functions.https.onRequest(main);