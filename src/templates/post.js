import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";
import Cookies from "universal-cookie";
import "../styles/post.css";
import { loadStripe } from "@stripe/stripe-js";
import * as tocbot from "tocbot";
import { constants } from "../utils/constants";
import { Image } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import postScript from "../post-script.js";
import visJS from "../vis.js";
import { navigate } from "gatsby";
/**
 * Single post view (/:slug)
 *
 * This file renders a single post and loads all the content.
 *
 */
const Post = ({ data, location, pageContext }) => {
    // let audio;
    // if (typeof window !== "undefined") {
    //     audio = new Audio("");
    // }
    const [nextPageUrl, setNextPageURL] = useState(
        pageContext.next ? pageContext.next.slug : ""
    );
    const [prevPageUrl, setPrevPageUrl] = useState(
        pageContext.prev ? pageContext.prev.slug : ""
    );

    const post = data.ghostPost;

    if (!post) {
        const isBrowser = () => typeof window !== "undefined";
        isBrowser() && window.location.replace(process.env.GATSBY_SITE_URL);
    }
    const fisrtTagPlan = post?.tags[0] ? post.tags[0].name : "";
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [apiResponse, setApiResponse] = useState(false);
    const [userPlanId, setUserPlanId] = useState("");
    const [planType, setPlanType] = useState("");
    const [email, setEmail] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [selectedTextXCoor, setSelectedTextXCoor] = useState(0);
    const [selectedTextYCoor, setSelectedTextYCoor] = useState(0);
    const [enableTextToPlayPopup, setEnableTextToPlayPopup] = useState("none");
    const [userSelectedText, setUserSelectedText] = useState("");
    //const [audio, setAudio] = useState(new Audio(""));

    const [audioStatus, changeAudioStatus] = useState(false);
    const myRef = useRef();

    useEffect(async () => {
        visJS();
        postScript();

        if (typeof window !== "undefined") {
            window.addEventListener("keydown", (e) => {
                const currentUrl =
                    typeof window !== "undefined"
                        ? window.location.pathname
                        : "";
                let keyPressed = e.key;
                if (
                    currentUrl != "/login" &&
                    currentUrl != "/signup" &&
                    currentUrl != "/forgotpassword"
                ) {
                    if (nextPageUrl != "" && keyPressed == "ArrowRight") {
                        navigate("/" + nextPageUrl);
                    } else if (prevPageUrl != "" && keyPressed == "ArrowLeft") {
                        navigate("/" + prevPageUrl);
                    } else if (keyPressed == "Escape") {
                        navigate("/");
                    }
                }
            });
        }

        const cookies = new Cookies();
        if (cookies.get("loggedInUser")) {
            const userEmail = cookies.get("loggedInUser");
            await fetch("/.netlify/functions/get-user", {
                method: "POST",
                body: JSON.stringify({ userEmail }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    setApiResponse(true);
                    if (
                        responseJson.user[0].user_ip ==
                        cookies.get("loggedInUserIpAddress")
                    ) {
                        setEmail(responseJson.user[0].user_email);
                        setCustomerId(responseJson.user[0].stripe_id);
                        setUserPlanId(responseJson.user[0].plan_id);
                        setUserLoggedIn(true);
                    } else {
                        cookies.remove("loggedInUser");
                        cookies.remove("loggedInUserIpAddress");
                    }
                });
        } else {
            setApiResponse(true);
        }
    }, []);

    function validateForm() {
        return planType.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
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

    async function premiumCheckout(e) {
        e.preventDefault();
        const planType = "premium";
        if (
            !confirm(
                "Du har nu et Pro abonnement, hvis du skifter til premium abonnement, annulleres dit pro abonnement. Fremadrettet betaler du kun betaler for et premium abonnement. Er du sikker?"
            )
        ) {
            return;
        }
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

    function enableDisableSpeech(checked) {
        setSpeechTextEnable(checked);
        if (checked) {
        } else {
            audio.pause();
        }
    }

    async function selectedText(event) {
        if (typeof window !== "undefined") {
            let textToSpeech = "";
            textToSpeech = window.getSelection().toString();
            if (textToSpeech) {
                setUserSelectedText(textToSpeech);
                setEnableTextToPlayPopup("block");
                setSelectedTextXCoor(event.pageX);
                setSelectedTextYCoor(event.pageY);
            }
        }
    }

    function playText() {
        myRef.current.pause();
        myRef.current.currentTime = 0;
        setEnableTextToPlayPopup("none");
        const url =
            "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyBpsYZKqwyVctQKamQf4StfhvSWSSz-2lE";
        const data = {
            input: {
                text: userSelectedText,
            },
            voice: {
                languageCode: "da-dk",
                name: "da-DK-Wavenet-A",
                ssmlGender: "FEMALE",
            },
            audioConfig: {
                audioEncoding: "MP3",
            },
        };
        const otherparam = {
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(data),
            method: "POST",
        };
        fetch(url, otherparam)
            .then((data) => {
                return data.json();
            })
            .then((res) => {
                myRef.current.src = "data:audio/wav;base64," + res.audioContent;
                myRef.current.play();
            })
            .catch((error) => {
                console.state.onError(error);
            });
    }

    return (
        <div>
            <span
                className="popup-tag"
                style={{
                    top: selectedTextYCoor,
                    left: selectedTextXCoor,
                    display: enableTextToPlayPopup,
                }}
                onClick={playText}
            >
                Tale
            </span>
            <audio ref={myRef} src="" />
            <MetaData data={data} location={location} type="article" />
            <Helmet>
                <style type="text/css">{`${post?.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                {apiResponse &&
                (fisrtTagPlan == constants.FREE_POST ||
                    userPlanId == constants.USER_PREMIUM_PLAN_ID ||
                    (userPlanId == constants.USER_PRO_PLAN_ID &&
                        fisrtTagPlan == constants.PRO_POST)) ? (
                    <article className="content">
                        <Helmet>
                            <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
                        </Helmet>
                        {post.feature_image ? (
                            <figure className="post-feature-image">
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                />
                            </figure>
                        ) : null}
                        <aside className="toc-container">
                            <div className="toc"></div>
                        </aside>
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{
                                    __html: post.html,
                                }}
                                onPointerUpCapture={selectedText}
                            />
                        </section>
                    </article>
                ) : apiResponse &&
                  !userLoggedIn &&
                  (fisrtTagPlan == constants.PRO_POST ||
                      fisrtTagPlan == constants.PREMIUM_POST) ? (
                    <div className="card">
                        <div className="card-body">
                            <h2 className="whiteClr">
                                Dette kapitel er kun for betalende abonnenter
                            </h2>
                            <p className="font-18">
                                Har du allerede abonnement?{" "}
                                <a href="/login">Login</a>
                            </p>
                        </div>
                    </div>
                ) : apiResponse &&
                  userLoggedIn &&
                  userPlanId == constants.USER_NO_PLAN_ID &&
                  (fisrtTagPlan == constants.PRO_POST ||
                      fisrtTagPlan == constants.PREMIUM_POST) ? (
                    <div className="card">
                        <div className="card-body">
                            <h2 className="whiteClr accessMsg">
                                Dette kapitel er kun for betalende abonnenter
                            </h2>
                            <div className="form-group">
                                <label className="font-size-15">
                                    Vælg abonnement
                                </label>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label
                                            data-tip="Adgang til Pro indhold, 49.00kr DKK / Pr. måned"
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
                                            />{" "}
                                            Pro
                                        </label>
                                        <label data-tip="Fuld adgang Premium for, 69.00kr DKK / Pr. måned">
                                            <input
                                                type="radio"
                                                name="size"
                                                id="premium"
                                                value="premium"
                                                required
                                                onChange={(e) =>
                                                    setPlanType(e.target.value)
                                                }
                                            />{" "}
                                            Premium
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-premiume"
                                        disabled={!validateForm()}
                                    >
                                        Opgrader abonnement
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : apiResponse &&
                  userLoggedIn &&
                  userPlanId == constants.USER_PRO_PLAN_ID &&
                  fisrtTagPlan == constants.PREMIUM_POST ? (
                    <div className="card">
                        <div className="card-body">
                            <h2 className="whiteClr accessMsg">
                                Dette kapitel er kun for premium abonnenter
                            </h2>
                            <button
                                type="submit"
                                className="btn btn-primary btn-premiume"
                                onClick={premiumCheckout}
                            >
                                Opgrader til premium
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="loadwrap">
                        <div>
                            <div className="bounceball"></div>
                            <div className="loadText">Indlæser nu!</div>
                        </div>
                    </div>
                )}
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a
                                className={
                                    "btn btn-primary btn-lg " +
                                    (prevPageUrl ? "" : "disabled")
                                }
                                href={prevPageUrl ? "/" + prevPageUrl : ""}
                            >
                                &#8592;
                            </a>
                        </li>

                        <li className="page-item">
                            <a
                                className={
                                    "btn btn-primary btn-lg " +
                                    (nextPageUrl ? "" : "disabled")
                                }
                                href={nextPageUrl ? "/" + nextPageUrl : ""}
                            >
                                &#8594;
                            </a>
                        </li>
                    </ul>
                </nav>
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
        ghostPost(
            slug: { eq: $slug }
            tags: { elemMatch: { name: { eq: "Statistik" } } }
        ) {
            ...GhostPostFields
        }
    }
`;
