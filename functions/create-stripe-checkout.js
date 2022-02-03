const stripe = require("stripe")(process.env.GATSBY_STRIPE_SK_KEY);

exports.handler = async function (event) {
    const { email, customerId, planType } = JSON.parse(event.body);

    let price = "";
    if (planType == "pro") {
        price = process.env.GATSBY_PRO_PLAN_PRICE;
    } else {
        price = process.env.GATSBY_PREMIUM_PLAN_PRICE;
    }

    const userAllSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
    });

    let isUserHasSubscriptionAlready = false;
    await userAllSubscriptions.data.forEach(async (element) => {
        if (element.status == "active" && element.pause_collection == null) {
            if (element.plan.id !== process.env.GATSBY_FREE_PLAN_PRICE) {
                isUserHasSubscriptionAlready = true;
            }
        }
    });

    if (isUserHasSubscriptionAlready) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Error" }),
        };
    } else {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            success_url: process.env.GATSBY_SITE_URL,
            cancel_url: process.env.GATSBY_SITE_URL,
            payment_method_types: ["card"],
            line_items: [{ price: price, quantity: 1 }],
            mode: "subscription",
        });

        return {
            statusCode: 200,
            body: JSON.stringify(session),
        };
    }
};
