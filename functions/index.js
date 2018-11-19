require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = new admin.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings);


const testUser = {
  email: "test@test.com",
  source: 'tok_visa'
}

exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const customer = await stripe.customers.create(testUser);
    const stripeUser = {
      authId: 'Y099jN9mo6V31JRVR4MfvoOHzAw2',
      email: testUser.email,
      stripeId: customer.id
    }
    return admin.firestore().collection('users').doc(stripeUser.authId).set(stripeUser).then(() => {
      return res.status(303).send('CREATED_USER');
    }).catch((err) => {
      return res.status(500).send('ERROR_');
    })
  } catch(err) {
    console.log('THERE WAS AN ERROR CREATING THE USER');
    console.log(err);
    res.send(JSON.stringify(err));
  }
});

exports.getUserStats = functions.https.onRequest((req, res) => {
  res.send("getUserStats");
})

exports.createSnuzes = functions.https.onRequest((req, res) => {
  console.log("still testing");
  res.send("Testing organization settings");
});