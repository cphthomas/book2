const stripe = require("stripe")(process.env.GATSBY_STRIPE_SK_KEY);
const connection = require("serverless-mysql")({
    config: {
        host: "lmc8ixkebgaq22lo.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
        database: "yj4gfzv5wypf9871",
        user: "ub4b7vh6mgd73b2b",
        password: "l7w4d31in0msovsc",
    },
});

exports.handler = async function ({ body, headers }, context) {
    try {
        const stripeEvent = await stripe.webhooks.constructEvent(
            body,
            headers["stripe-signature"],
            process.env.GATSBY_STRIPE_CHECKOUT_WEBHOOK
        );

        if (stripeEvent.type !== "checkout.session.completed") return;

        const subscription = await stripeEvent.data.object;
        const newSubscriptionId = await subscription.subscription;
        const paymentIntent = await subscription.payment_intent;
        const subscriptionStart = Date.now();
        let subscriptionEnd = "";

        let plan = "0";
        if (subscription.amount_total == "4900") {
            plan = "1";
            subscriptionEnd = Date.now();
        } else if (subscription.amount_total == "6900") {
            plan = "2";
            subscriptionEnd = Date.now();
        } else if (subscription.amount_total == "5900") {
            plan = "3";
            subscriptionEnd = Date.now();
        } else if (subscription.amount_total == "29000") {
            plan = "4";
            subscriptionEnd = subscriptionStart + 1000 * 60 * 60 * 24 * 180;
        } else if (subscription.amount_total == "39000") {
            plan = "5";
            subscriptionEnd = subscriptionStart + 1000 * 60 * 60 * 24 * 360;
        } else if (subscription.amount_total == "54000") {
            plan = "6";
            subscriptionEnd = subscriptionStart + 1000 * 60 * 60 * 24 * 720;
        }

        try {
            await connection.connect();

            await updateUser(
                connection,
                subscription.customer,
                subscriptionEnd,
                subscriptionStart,
                plan,
                subscription.customer_details.email,
                paymentIntent
            );

            await connection.end();

            const userAllSubscriptions = await stripe.subscriptions.list({
                customer: subscription.customer,
            });

            await userAllSubscriptions.data.forEach(async (element) => {
                if (element.id != newSubscriptionId) {
                    stripe.subscriptions.update(element.id, {
                        pause_collection: { behavior: "mark_uncollectible" },
                    });
                }
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ received: subscription.customer }),
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: `Webhook Error: ${error.message}`,
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }

        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({ received: subscription.customer }),
        // };
    } catch (err) {
        return {
            statusCode: 400,
            body: `Webhook Error: ${err.message}`,
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

async function updateUser(
    connection,
    stripeId,
    planEnd,
    planStart,
    plan,
    stripeEmail,
    paymentIntent
) {
    return new Promise((resolve, reject) => {
        connection.query(
            {
                sql:
                    "UPDATE external_users SET plan_id = ?, user_subscription_end = ?, user_subscription_start = ?, stripe_mail = ?, payment_intent = ? WHERE stripe_id = ?",
                timeout: 10000,
                values: [
                    plan,
                    planEnd,
                    planStart,
                    stripeEmail,
                    paymentIntent,
                    stripeId,
                ],
            },
            function (error, results, fields) {
                if (error) reject(err);
                resolve(results);
            }
        );
    });
}
