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
    const fullUser = {
      authId: req.body.user.authId,
      email: req.body.user.email,
      stripeId: customer.id
    }
    return admin.firestore().collection('users').doc(fullUser.authId).set(fullUser).then(() => {
      return res.status(303).send('CREATED_USER');
    }).catch((err) => {
      console.log(err);
      return res.status(500).send('ERR_FIREBASE');
    });
  } catch(err) {
    console.log(err);
    res.status(500).send('ERR_STRIPE');
  }
});

exports.getUserStats = functions.https.onRequest((req, res) => {
  res.send("getUserStats");
})

exports.createSnuzes = functions.https.onRequest((req, res) => {
  console.log(req.body.snuzes);
  req.body.snuzes.forEach(async (snuze) => {
    const date = moment(snuze.alarmTime, "YYYY-MM-DD HH:mm", true).toDate();
    snuze.alarmTime = date;
    try {
      const snuzeRef = await admin.firestore().collection('snuzes').add(snuze);
      console.log(snuzeRef.id);
      const userRef = await _getUser(req.body.userId);
      console.log('THIS IS THE USER');
      console.log(userRef.path, snuzeRef.path);
      // const updatedSnuze = admin.firestore().collection('snuzes').doc(snuzeRef.id).update({user: new admin.firestore.FieldPath(userRef.path)});
      // console.log('UPDATED SNUZE');
      // console.log(updatedSnuze);
      // const updatedUser = admin.firestore().collection('users').doc(userRef.id).update({
      //     snuzes: admin.firestore.FieldValue.arrayUnion(new admin.firestore.FieldPath(snuzeRef.path))
      //   });
      // console.log('UPDATED USER');
      // console.log(updatedUser);
    } catch (err) {
      console.log(err);
      console.log('FIREBASE ERR');
    }
  });
  res.send("createSnuzes done executing");
});

async function _getUser(userId) {
  const userRef = admin.firestore().collection('users').doc(userId);
  try {
    const user = userRef.get();
    return user;
  } catch(err) {
    console.log('ERROR_GETTING_USER');
  }
}