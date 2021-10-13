import React, { useEffect, useState } from "react";
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
// import { useSpeechSynthesis } from "react-speech-kit";
import Speech from "speak-tts";
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
    //const { speak } = useSpeechSynthesis();
    const [nextPageUrl, setNextPageURL] = useState(
        pageContext.next ? pageContext.next.slug : ""
    );
    const [prevPageUrl, setPrevPageUrl] = useState(
        pageContext.prev ? pageContext.prev.slug : ""
    );
    //let nextPageUrl = pageContext.next ? pageContext.next.slug : "";
    //let prevPageUrl = pageContext.prev ? pageContext.prev.slug : "";
    console.log(nextPageUrl);
    console.log(prevPageUrl);
    let speech;
    if (typeof window !== "undefined") {
        speech = new Speech();
        speech
            .init({
                volume: 0.5,
                lang: "da-DK",
                rate: 1,
                pitch: 1,
                //'voice':'Google UK English Male',
                //'splitSentences': false,
                listeners: {
                    onvoiceschanged: (voices) => {
                        //console.log("Voices changed", voices);
                    },
                },
            })
            .then((data) => {
                console.log("Speech is ready", data);
                _addVoicesList(data.voices);
                _prepareSpeakButton(speech);
            })
            .catch((e) => {
                console.error("An error occured while initializing : ", e);
            });
    }

    const post = data.ghostPost;

    if (!post) {
        const isBrowser = () => typeof window !== "undefined";
        isBrowser() && window.location.replace(process.env.GATSBY_SITE_URL);
    }
    const fisrtTagPlan = post?.tags[0] ? post.tags[0].name : "";
    //const secondTagBookAccess = post.tags[1] ? post.tags[1].name : "";
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [apiResponse, setApiResponse] = useState(false);
    const [userPlanId, setUserPlanId] = useState("");
    const [planType, setPlanType] = useState("");
    const [email, setEmail] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [speechTextEnable, setSpeechTextEnable] = useState(false);

    useEffect(async () => {
        visJS();
        postScript();

        if (typeof window !== "undefined") {
            window.addEventListener("keydown", (e) => {
                // console.log(e.key);
                // console.log(
                //     "------------------" +
                //         window.location.pathname +
                //         "------------------"
                // );
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

        // tocbot.init({
        //     tocSelector: ".toc",
        //     contentSelector: ".content-body",
        //     hasInnerContainers: true,
        // });
        // tocbot.refresh();

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
            // tocbot.init({
            //     tocSelector: ".toc",
            //     contentSelector: ".content-body",
            //     hasInnerContainers: true,
            // });
            // tocbot.refresh();
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
            console.log(checked);
            speech.cancel();
        }
    }

    async function selectedText() {
        // window.getSelection().toString()
        //     ? console.log(window.getSelection().toString())
        //     : null;
        let textToSpeech = "";
        if (typeof window !== "undefined") {
            textToSpeech = window.getSelection().toString();
        }
        console.log(speechTextEnable);
        //speak({ text: textToSpeech });
        if (speechTextEnable) {
            speech
                .speak({
                    text: textToSpeech,
                    queue: false,
                    listeners: {
                        onstart: () => {
                            console.log("Start utterance");
                        },
                        onend: () => {
                            console.log("End utterance");
                        },
                        onresume: () => {
                            console.log("Resume utterance");
                        },
                        onboundary: (event) => {
                            console.log(
                                event.name +
                                    " boundary reached after " +
                                    event.elapsedTime +
                                    " milliseconds."
                            );
                        },
                    },
                })
                .then((data) => {
                    console.log("Success !", data);
                })
                .catch((e) => {
                    console.error("An error occurred :", e);
                });
        }
    }

    // async function serachInPage(e) {
    //     let code = e.keyCode ? e.keyCode : e.which;
    //     //console.log(code);
    //     if (code == 13) {
    //         if (
    //             typeof window !== "undefined" &&
    //             !window.find(e.target.value) &&
    //             e.target.value != ""
    //         ) {
    //             alert("No result!");
    //         }
    //     }
    // }

    return (
        <div>
            <MetaData data={data} location={location} type="article" />
            <Helmet>
                <style type="text/css">{`${post?.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                {/* <div class="search-container">
                    <input
                        class="search"
                        id="searchleft"
                        type="search test"
                        name="q"
                        onKeyUp={(e) => serachInPage(e)}
                        placeholder="Søg i kapitlet"
                    />
                    <label class="button searchbutton" for="searchleft">
                        <span class="mglass">&#9906;</span>
                    </label>
                </div> */}
                {apiResponse &&
                (fisrtTagPlan == constants.FREE_POST ||
                    userPlanId == constants.USER_PREMIUM_PLAN_ID ||
                    (userPlanId == constants.USER_PRO_PLAN_ID &&
                        fisrtTagPlan == constants.PRO_POST)) ? (
                    <article className="content">
                        <Helmet>
                            <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
                            {/* <script
                                id="MathJax-script"
                                async
                                src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
                            ></script> */}
                        </Helmet>
                        {post.feature_image ? (
                            <figure className="post-feature-image">
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                />
                            </figure>
                        ) : null}
                        <div className="switchBtn">
                            <BootstrapSwitchButton
                                checked={speechTextEnable}
                                onstyle="dark"
                                offstyle="dark"
                                style="border"
                                onlabel="Tale"
                                offlabel="Ingen tale"
                                onChange={enableDisableSpeech}
                                style={{ border: "none" }}
                            />
                        </div>
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
                                onMouseUpCapture={selectedText}
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
