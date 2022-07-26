const stripe = require("stripe")(process.env.GATSBY_STRIPE_SK_KEY);

exports.handler = async function (event) {
    const { customerPaymentIntent } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.retrieve(
        customerPaymentIntent
    );

    return {
        statusCode: 200,
        body: JSON.stringify(paymentIntent),
    };
};
