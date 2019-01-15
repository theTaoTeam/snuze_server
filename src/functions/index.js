require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
// const moment = require('moment');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const serviceAccount = require(process.env.SERVICE_ACCOUNT);
// const FieldValue = admin.firestore.FieldValue;

admin.initializeApp();

const firestore = new admin.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings);

exports.createStripeUser = functions.https.onCall(async (data, context) => {
  const stripeData = {
    email: data.email,
    source: data.source
  }
  try {
    const stripeCustomer = await stripe.customers.create(stripeData);
    return { id: stripeCustomer.id };
  } catch(err) {
    console.log(err);
    throw new functions.https.HttpsError('stripe-error', 'error creating stripe customer');
  }
});