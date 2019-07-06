require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp();

app.post(path, (req, res) => {
  const stripe_version = req.query.api_version;
  if (!stripe_version) {
    res.status(400).end();
    return;
  }
  // This function assumes that some previous middleware has determined the
  // correct customerId for the session and saved it on the request object.
  stripe.ephemeralKeys.create(
    { customer: req.customerId },
    { stripe_version: stripe_version }
  ).then((key) => {
    res.status(200).json(key);
  }).catch((err) => {
    res.status(500).end();
  });
});