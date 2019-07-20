import * as functions from 'firebase-functions';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as Stripe from 'stripe';

config({ path: resolve(__dirname, '../.env') });
const stripe = new Stripe(process.env.STRIPE_SK as string);

exports.createStripeUser = functions.https.onCall(async (data, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated request');
  }
  const stripeData = {
    email: data.email,
  }

  try {
    const stripeCustomer = await stripe.customers.create(stripeData);
    return { id: stripeCustomer.id };
  } catch(err) {
    throw new functions.https.HttpsError('aborted', 'error creating stripe customer');
  }
});

exports.createSetupIntent = functions.https.onCall(async (data, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  const stripeData = {
    customer: data.stripeId,
    payment_method: data.paymentMethod,
    payment_method_types: ['card'],
    confirm: true
  }

  try {
    // @ts-ignore
    const setupIntent = await stripe.setupIntents.create(stripeData);
    console.log(setupIntent);
    return setupIntent;
  } catch(err) {
    console.log(err);
    throw new functions.https.HttpsError('aborted', 'error creating stripe setupIntent');
  }
});