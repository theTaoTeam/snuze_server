import * as functions from 'firebase-functions';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as Stripe from 'stripe';

config({ path: resolve(__dirname, '../.env') });
const stripe = new Stripe(process.env.STRIPE_SK as string);

exports.getStripeEphemeralKey = functions.https.onRequest((req, res) => {
  const stripeVersion: string = req.query.api_version;
  if (!stripeVersion) {
    res.status(400).end();
    return;
  }
  // This function assumes that some previous middleware has determined the
  // correct customerId for the session and saved it on the request object.
  stripe.ephemeralKeys.create(
    { customer: req.body.customerId },
    { stripe_version: stripeVersion }
  ).then((key: Stripe.ephemeralKeys.IEphemeralKey) => {
    res.status(200).json(key);
  }).catch((err: any) => {
    res.status(500).end();
  });
});