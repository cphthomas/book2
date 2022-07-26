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
            process.env.GATSBY_STRIPE_DELETE_WEBHOOK
        );
        if (stripeEvent.type !== "customer.subscription.deleted") return;

        const subscription = await stripeEvent.data.object;

        try {
            await connection.connect();
            //await updateUser(connection, subscription.customer, 0);

            const userAllSubscriptions = await stripe.subscriptions.list({
                customer: subscription.customer,
                limit: 1,
            });

            let newPlan = 0;
            await userAllSubscriptions.data.forEach(async (element) => {
                if (
                    element.status == "active" &&
                    element.pause_collection == null
                ) {
                    if (element.plan.id == process.env.GATSBY_FREE_PLAN_PRICE) {
                        newPlan = 0;
                    } else if (
                        element.plan.id == process.env.GATSBY_PRO_PLAN_PRICE
                    ) {
                        newPlan = 1;
                    } else if (
                        element.plan.id == process.env.GATSBY_PREMIUM_PLAN_PRICE
                    ) {
                        newPlan = 2;
                    } else if (
                        element.plan.id ==
                        process.env.GATSBY_MONTHLY_SIXTY_PLAN_PRICE
                    ) {
                        newPlan = 3;
                    } else if (
                        element.plan.id ==
                        process.env.GATSBY_ONE_TIME_FIRST_PLAN_PRICE
                    ) {
                        newPlan = 4;
                    } else if (
                        element.plan.id ==
                        process.env.GATSBY_ONE_TIME_SECOND_PLAN_PRICE
                    ) {
                        newPlan = 5;
                    } else if (
                        element.plan.id ==
                        process.env.GATSBY_ONE_TIME_THIRD_PLAN_PRICE
                    ) {
                        newPlan = 6;
                    }
                } else {
                    newPlan = 0;
                }
            });

            await updateUser(connection, subscription.customer, newPlan);

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
        } finally {
            if (connection) {
                connection.end();
            }
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
