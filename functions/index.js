require('dotenv').config();
const functions = require('firebase-functions');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.createUser = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const customer = createStripeCustomer();
});

exports.createSnuzes = functions.https.onRequest((req, res) => {
  res.send("Testing organization settings");
});

async function createStripeCustomer() {
  try {
    const customer = await stripe.customers.create({
      email: 'wes@test.com'
    });
    console.log(customer);
  } catch (error) {
    console.log(error);
  }
}