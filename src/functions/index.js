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
    return functions.https.HttpsError('stripe-error', 'error creating stripe customer');
  }
});

// exports.createUser = functions.https.onRequest(async (req, res) => {
//   try {
//     const stripeData = {
//       email: req.body.user.email,
//       source: req.body.user.source,
//     }
//     const customer = await stripe.customers.create(stripeData);

//     const invoiceRef = firestore.collection('invoices').doc();
//     const fullUser = {
//       uid: req.body.user.uid,
//       stripeId: customer.id,
//       activeInvoice: invoiceRef,
//       invoiceRefs: FieldValue.arrayUnion(invoiceRef)
//     };
//     await firestore
//       .collection('users')
//       .doc(fullUser.uid)
//       .set(fullUser).catch(err => {
//         console.log(err);
//         return Promise.reject(new Error('Error creating user'));
//       });
    
//     const fullInvoice = {
//       billed: false,
//       currentTotal: 0,
//       id: invoiceRef.id,
//       snuzeRefs: [],
//       userRef: firestore.collection('users').doc(fullUser.uid)
//     };
//     await invoiceRef.set(fullInvoice).catch(err => {
//       console.log(err);
//       return Promise.reject(new Error('Error creating invoice'));
//     });
    
//     return res.send('CREATED_USER');
//   } catch(err) {
//     console.log(err);
//     return res.status(500).send('ERR_CREATE_USER');
//   }
// });

// exports.getUserStats = functions.https.onRequest((req, res) => {
//   res.send("getUserStats");
// });

// exports.createSnuzes = functions.https.onRequest((req, res) => {
//   const snuzeCollectionRef = firestore.collection('snuzes');
//   const userDocRef = firestore.collection('users').doc(req.body.userId);
//   firestore.runTransaction(async (transaction) => {
//     try {
//       // read operations must happen before write operations in a transaction
//       const userDoc = await transaction.get(userDocRef);
//       const invoiceRef = userDoc.data().activeInvoice;
//       const invoiceDoc = await transaction.get(invoiceRef);
//       let snuzeAmtTotal = 0;
//       // collect references to add to current invoice
//       let snuzeRefs = [];
//       // create a list of promises to handle in parallel
//       let snuzeDocPromises = [];
//       for(let snuze of req.body.snuzes) {
//         // convert alarmTime into date format usable by firebase
//         snuze.alarmTime = moment(snuze.alarmTime, "YYYY-MM-DD HH:mm", true).toDate();
//         snuzeAmtTotal += snuze.snuzeAmount;
//         const snuzeRef = snuzeCollectionRef.doc();
//         snuzeRefs.push(snuzeRef);
//         snuze.id = snuzeRef.id;
//         snuze.invoideRef = invoiceRef;
//         const snuzeDoc = transaction.set(snuzeRef, snuze);
//         snuzeDocPromises.push(snuzeDoc);
//       }
//         // fire all promises in parallel
//       await Promise.all(snuzeDocPromises);
//       await transaction.update(invoiceRef, {
//         currentTotal: invoiceDoc.data().currentTotal + snuzeAmtTotal,
//         snuzeRefs: FieldValue.arrayUnion(...snuzeRefs),
//       });
//     } catch(err) {
//       console.log(err);
//       return Promise.reject(new Error('Something went wrong'));
//     }
//   })
//   .then(() => {
//     return res.send('CREATED_SNUZES');
//   })
//   .catch(err => {
//     console.log(err);
//     return res.send('ERR_FIREBASE_SNUZES');
//   });
// });