import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as Stripe from 'stripe';

config({ path: resolve(__dirname, '../.env') });
const stripe = new Stripe(process.env.STRIPE_SK as string);
const db = admin.firestore();

exports.getStripeEphemeralKey = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  const stripeVersion: string = data.query.api_version;
  if (!stripeVersion) {
    throw new functions.https.HttpsError('invalid-argument', 'Stripe version not found in request');
  }

  try {
    const userDocRef = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDocRef.data();
    if (!userData) {
      throw new Error('User doesn\'t exist');
    }
    const key: Stripe.ephemeralKeys.IEphemeralKey = await stripe.ephemeralKeys.create(
      { customer: userData.stripeCustomerId },
      { stripe_version: stripeVersion }
    )
    return key;
  } catch (e) {
    throw new functions.https.HttpsError('unknown', 'Error occurred');
  }
});