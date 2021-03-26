import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";
import Cookies from "universal-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import "../styles/post.css";
import ReactTooltip from "react-tooltip";
import { loadStripe } from "@stripe/stripe-js";

/**
 * Single post view (/:slug)
 *
 * This file renders a single post and loads all the content.
 *
 */
const Post = ({ data, location }) => {
    const post = data.ghostPost;
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [apiResponse, setApiResponse] = useState(false);
    const [userPlanId, setUserPlanId] = useState("");
    const [planType, setPlanType] = useState("");
    const [email, setEmail] = useState("");
    const [customerId, setCustomerId] = useState("");
    //console.log(post.tags[0].name);

    useEffect(async () => {
        const cookies = new Cookies();
        if (cookies.get("loggedInUser")) {
            const userEmail = cookies.get("loggedInUser");
            await fetch("/.netlify/functions/get-user", {
                method: "POST",
                body: JSON.stringify({ userEmail }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.user[0].plan_id);
                    setApiResponse(true);
                    setEmail(responseJson.user[0].user_email);
                    setCustomerId(responseJson.user[0].stripe_id);
                    setUserPlanId(responseJson.user[0].plan_id);
                });
            setUserLoggedIn(true);
        } else {
            setApiResponse(true);
        }
    }, []);

    function validateForm() {
        return planType.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(customerId);
        await fetch("/.netlify/functions/create-stripe-checkout", {
            method: "POST",
            body: JSON.stringify({ customerId, email, planType }),
        })
            .then(async (response) => response.json())
            .then(async (responseJson) => {
                console.log(responseJson);
                const stripePromise = await loadStripe(
                    "pk_test_VtVbrLQ6xPiMm1pMmRVsiU1U"
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

    async function premiumCheckout(e) {
        e.preventDefault();
        console.log(customerId);
        const planType = "premium";
        await fetch("/.netlify/functions/create-stripe-checkout", {
            method: "POST",
            body: JSON.stringify({ customerId, email, planType }),
        })
            .then(async (response) => response.json())
            .then(async (responseJson) => {
                console.log(responseJson);
                const stripePromise = await loadStripe(
                    "pk_test_VtVbrLQ6xPiMm1pMmRVsiU1U"
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

    return (
        <div>
            <MetaData data={data} location={location} type="article" />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>

            <Layout>
                {apiResponse && userLoggedIn && userPlanId == "2" ? (
                    <article className="content">
                        {post.feature_image ? (
                            <figure className="post-feature-image">
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                />
                            </figure>
                        ) : null}
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>

                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{
                                    __html: post.html,
                                }}
                            />
                        </section>
                    </article>
                ) : apiResponse &&
                  userLoggedIn &&
                  userPlanId == "1" &&
                  post.tags[0].name == "Premium" ? (
                    <div class="cardDiv">
                        <Card class="card">
                            <Card.Body>
                                <h2>
                                    This post is for premium subscribers only
                                </h2>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block btn-premiume"
                                    onClick={premiumCheckout}
                                >
                                    Upgrade to premium
                                </button>
                            </Card.Body>
                        </Card>
                    </div>
                ) : apiResponse &&
                  userLoggedIn &&
                  userPlanId == "1" &&
                  post.tags[0].name == "Pro" ? (
                    <article className="content">
                        {post.feature_image ? (
                            <figure className="post-feature-image">
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                />
                            </figure>
                        ) : null}
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>

                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{
                                    __html: post.html,
                                }}
                            />
                        </section>
                    </article>
                ) : apiResponse && userLoggedIn && userPlanId == "0" ? (
                    <div class="cardDiv">
                        <Card class="card">
                            <Card.Body>
                                <h2>
                                    This post is for paying subscribers only
                                </h2>
                                <div className="form-group">
                                    <label className="font-size-15">
                                        Choose your subscription
                                    </label>
                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <label
                                                data-tip="Access to pro content with, 49.00kr DKK / Month"
                                                className="margin-right-20"
                                            >
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    id="pro"
                                                    value="pro"
                                                    onChange={(e) =>
                                                        setPlanType(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />{" "}
                                                Pro
                                            </label>
                                            <label data-tip="Full Access with, 69.00kr DKK / Month">
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    id="premium"
                                                    value="premium"
                                                    required
                                                    onChange={(e) =>
                                                        setPlanType(
                                                            e.target.value
                                                        )
                                                    }
                                                />{" "}
                                                Premium
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block btn-color"
                                            disabled={!validateForm()}
                                        >
                                            Upgrade Subscription
                                        </button>
                                    </form>
                                </div>
                                <ReactTooltip />
                            </Card.Body>
                        </Card>
                    </div>
                ) : apiResponse && !userLoggedIn ? (
                    <div class="cardDiv">
                        <Card class="card">
                            <Card.Body>
                                <h2>
                                    This post is for paying subscribers only
                                </h2>
                                <p>
                                    <small>
                                        Already have an account?{" "}
                                        <a href="/login">Sign in</a>
                                    </small>
                                </p>
                            </Card.Body>
                        </Card>
                    </div>
                ) : (
                    ""
                )}
            </Layout>
        </div>
    );
};

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
};

export default Post;

export const postQuery = graphql`
    query($slug: String!) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
    }
`;
