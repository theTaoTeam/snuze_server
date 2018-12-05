require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const moment = require('moment');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = new admin.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings);
const FieldValue = admin.firestore.FieldValue;


const testUser = {
  email: "clamptron@gmail.com",
  source: 'tok_visa'
}

exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const stripeData = {
      email: req.body.user.email,
      source: req.body.user.source,
    }
    const customer = await stripe.customers.create(stripeData);

    const invoiceRef = firestore.collection('invoices').doc();
    const fullUser = {
      authId: req.body.user.authId,
      email: req.body.user.email,
      stripeId: customer.id,
      activeInvoice: invoiceRef,
      invoiceRefs: FieldValue.arrayUnion(invoiceRef)
    };
    return firestore
      .collection('users')
      .doc(fullUser.authId)
      .set(fullUser)
      .then(() => {
        return res.status(303).send('CREATED_USER');
      }).catch((err) => {
        console.log(err);
        return res.status(500).send('ERR_FIREBASE');
      });
  } catch(err) {
    console.log(err);
    res.status(500).send('ERR_CREATE_USER');
  }
});

exports.getUserStats = functions.https.onRequest((req, res) => {
  res.send("getUserStats");
})

exports.createSnuzes = functions.https.onRequest((req, res) => {
  const snuzeCollectionRef = firestore.collection('snuzes');
  const userDocRef = firestore.collection('users').doc(req.body.userId);
  firestore.runTransaction(async (transaction) => {
    try {
      const invoiceRef = await transaction;
      // read operations must happen before write operations in a transaction
      const userDoc = await transaction.get(userDocRef);
      // create a list of references to add to user object in one transaction
      let snuzeReferences = [];
      for(let snuze of req.body.snuzes) {
        // convert alarmTime into date format usable by firebase
        snuze.alarmTime = moment(snuze.alarmTime, "YYYY-MM-DD HH:mm", true).toDate();
        snuze.billed = false;
        try {
          const snuzeRef = snuzeCollectionRef.doc();
          const snuzeDoc = await transaction.set(snuzeRef, snuze);
          snuzeReferences.push(snuzeRef);
        } catch (err) {
          console.log(err);
          return Promise.reject(new Error("Something went wrong"));
        }
        // update snuze references on user object all at once
      }
      res.send('CREATED_SNUZES');
    } catch(err) {
      console.log(err);
      return Promise.reject(new Error('Something went wrong'));
    }
  })
  .catch(err => {
    res.send('ERR_FIREBASE_SNUZES');
  });
});

// async function _getUser(userId) {
//   const userRef = firestore.collection('users').doc(userId);
//   try {
//     const user = userRef.get();
//     return user;
//   } catch(err) {
//     console.log('ERROR_GETTING_USER');
//   }
// }