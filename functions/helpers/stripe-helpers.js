require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

async function createStripeCustomerWithSource(user, token) {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
    });
    console.log(customer);
    const source = await stripe.customers.createSource(customer.id,
      {
        source: token
      },
      function(err, source) {
        return err ? err : source;
      }
    );
    console.log(source);
    return source;
  } catch(err) {
    console.log(err);
  }
}


module.exports = {
  createStripeCustomerWithSource,
}