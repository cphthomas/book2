const stripe = require("stripe")("sk_test_6uOkcnnJw0VAoDZmIaKWEqzu");
var mysql = require("mysql");

exports.handler = async function (event) {
    const { email, password } = JSON.parse(event.body);

    var connection = await mysql.createConnection({
        host: "lmc8ixkebgaq22lo.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
        user: "ub4b7vh6mgd73b2b",
        password: "l7w4d31in0msovsc",
        database: "yj4gfzv5wypf9871",
    });
    await connection.connect();
    const existUserResult = await getUserDetail(connection, email, password);
    console.log(existUserResult);

    if (!existUserResult[0]) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                error: "1",
                message: "User not exist",
            }),
        };
    }

    await connection.end();

    return {
        statusCode: 200,
        body: JSON.stringify({
            error: "0",
            customerId: existUserResult[0].stripe_id,
            planId: existUserResult[0].plan_id,
            emailId: existUserResult[0].user_email,
            message: "User logged in",
        }),
    };
};

async function getUserDetail(connection, email, password) {
    return new Promise((resolve, reject) => {
        connection.query(
            {
                sql:
                    "SELECT * FROM `external_users` WHERE `user_email` = ? AND `user_password` = ?",
                values: [email, password],
            },
            function (error, results, fields) {
                if (error) reject(err);
                resolve(results);
            }
        );
    });
}