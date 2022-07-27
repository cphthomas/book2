import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Layout } from "../components/common";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import Cookies from "universal-cookie";
import ReactTooltip from "react-tooltip";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [planType, setPlanType] = useState("");
    const [name, setName] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        const cookies = new Cookies();
        if (cookies.get("loggedInUser")) {
            window.location.href = "/";
        }
    }, []);

    function validateForm() {
        return email.length > 0 && password.length > 0 && planType.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setShowMessage(false);
        setIsFormSubmitted(true);
        if (password.length < 6) {
            setMessageColor("red");
            setMessage("Password længde skal være mindst seks.");
            setIsFormSubmitted(false);
            setShowMessage(true);
            return;
        }
        let customerId;
        const cookies = new Cookies();
        await fetch("/.netlify/functions/sign-up", {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.error == "1") {
                    setMessageColor("red");
                    setMessage(responseJson.message);
                    setIsFormSubmitted(false);
                } else {
                    customerId = responseJson.customerId;
                    setMessageColor("green");
                    setMessage(responseJson.message);
                    cookies.set("loggedInUser", email, {
                        path: "/",
                        maxAge: 31536000,
                    });
                    cookies.set("loggedInUserIpAddress", responseJson.userIp, {
                        path: "/",
                        maxAge: 31536000,
                    });
                }
                setShowMessage(true);
            })
            .catch((error) => {
                console.error(error);
            });

        if (customerId) {
            await fetch("/.netlify/functions/create-stripe-checkout", {
                method: "POST",
                body: JSON.stringify({ customerId, email, planType }),
            })
                .then(async (response) => response.json())
                .then(async (responseJson) => {
                    const stripePromise = await loadStripe(
                        process.env.GATSBY_STRIPE_PK_KEY
                    );
                    const stripe = await stripePromise;
                    await stripe.redirectToCheckout({
                        sessionId: responseJson.id,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    return (
        <Layout>
            <Helmet>
                <title>Signup</title>
                <link rel="icon" href="/tumbler-new.png" sizes="16x16"></link>
            </Helmet>
            <div className="form-div customFormDiv">
                <form onSubmit={handleSubmit}>
                    <h1 className="page-title">Køb adgang Statistik</h1>

                    <div className="form-group">
                        <label>Navn</label>
                        <input
                            type="name"
                            className="form-control"
                            placeholder="Skriv navn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isFormSubmitted}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Skriv email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isFormSubmitted}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Skriv password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength="12"
                            disabled={isFormSubmitted}
                        />
                    </div>

                    <div className="form-group">
                        <label>Vælg abonnement</label>
                        {/* <div>
                            <label
                                data-tip="Adgang til Statistik Pro indhold, 49.00kr DKK / Pr. måned"
                                className="margin-right-20"
                            >
                                <input
                                    type="radio"
                                    name="size"
                                    id="pro"
                                    value="pro"
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    required
                                    disabled={isFormSubmitted}
                                />{" "}
                                Pro
                            </label>
                            <label data-tip="Fuld adgang Statistik Premium, 69.00kr DKK / Pr. måned">
                                <input
                                    type="radio"
                                    name="size"
                                    id="premium"
                                    value="premium"
                                    required
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    disabled={isFormSubmitted}
                                />{" "}
                                Premium
                            </label>
                        </div> */}
                        <div>
                            <label
                                data-tip="Månedsabonnement 59,- DKK mest fleksibelt afmeld når det passer dig"
                                className="margin-right-20"
                            >
                                <input
                                    type="radio"
                                    name="size"
                                    id="monthly_sixty"
                                    value="monthly_sixty"
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    required
                                    disabled={isFormSubmitted}
                                />{" "}
                                Pr måned 59,- DKK
                            </label>
                            <label
                                data-tip="6 months 290 - DKK one time price"
                                className="margin-right-20"
                            >
                                <input
                                    type="radio"
                                    name="size"
                                    id="six_months_one_time"
                                    value="six_months_one_time"
                                    required
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    disabled={isFormSubmitted}
                                />{" "}
                                6 months 290 - DKK
                            </label>
                            <label
                                data-tip="12 months 390 - DKK one time price"
                                className="margin-right-20"
                            >
                                <input
                                    type="radio"
                                    name="size"
                                    id="twelve_months_one_time"
                                    value="twelve_months_one_time"
                                    required
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    disabled={isFormSubmitted}
                                />{" "}
                                12 months 390 - DKK
                            </label>
                            <label data-tip="24 months 540 - DKK one time price">
                                <input
                                    type="radio"
                                    name="size"
                                    id="twenty_four_months_one_time"
                                    value="twenty_four_months_one_time"
                                    required
                                    onChange={(e) =>
                                        setPlanType(e.target.value)
                                    }
                                    disabled={isFormSubmitted}
                                />{" "}
                                24 months 540 - DKK
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-color"
                        disabled={!validateForm() || isFormSubmitted}
                    >
                        Køb adgang nu
                    </button>
                    {showMessage ? (
                        <p className="message" style={{ color: messageColor }}>
                            {message}
                        </p>
                    ) : null}
                    <p className="tnc">
                        Ved tilmeldingen bekræfter du at have læst{" "}
                        <a href="/term-service" target="_blank">
                            abonnementsbetingelser
                        </a>{" "}
                        &{" "}
                        <a href="/privacy-policy" target="_blank">
                            privatlivspolitik
                        </a>
                        .
                    </p>
                    <p className="forgot-password text-right">
                        <a href="/login" class="btn btn-primary guideBtn">
                            Allerede medlem? Login
                        </a>
                    </p>
                    <p className="forgot-password text-right">
                        <a
                            href="/forgotpassword"
                            class="btn btn-primary guideBtn"
                        >
                            Glemt password?
                        </a>
                    </p>
                    <ReactTooltip />
                </form>
            </div>
        </Layout>
    );
}
