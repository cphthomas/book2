const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
            "whsec_QQfWIfXTmZW4ZSIR8ypfIbrb0YC7rRZ4"
        );
        if (stripeEvent.type !== "customer.subscription.deleted") return;

        const subscription = await stripeEvent.data.object;

        try {
            await connection.connect();

            await updateUser(connection, subscription.customer, 0);

            await connection.end();

            return {
                statusCode: 200,
                body: JSON.stringify({ received: subscription.customer }),
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: `Webhook Error: ${error.message}`,
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: `Webhook Error: ${error.message}`,
        };
    }
};

async function updateUser(connection, stripeId, plan) {
    return new Promise((resolve, reject) => {
        connection.query(
            {
                sql:
                    "UPDATE external_users SET plan_id = ? WHERE stripe_id = ?",
                timeout: 10000,
                values: [plan, stripeId],
            },
            function (error, results, fields) {
                if (error) reject(err);
                resolve(results);
            }
        );
    });
}
