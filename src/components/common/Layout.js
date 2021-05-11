import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link, StaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";
import {
    Button,
    Dropdown,
    ButtonGroup,
    Modal,
    Row,
    Col,
} from "react-bootstrap";
import { Navigation } from ".";
import config from "../../utils/siteConfig";
import Cookies from "universal-cookie";
import "../../styles/layout.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardSetupForm from "./CardSetupForm";

// Styles
import "../../styles/app.css";

/**
 * Main layout component
 *
 * The Layout component wraps around each page and template.
 * It also provides the header, footer as well as the main
 * styles, and meta data for each page.
 *
 */
const DefaultLayout = ({ data, children, bodyClass, isHome }) => {
    const [userLoggedIn, setUserLoggedIn] = useState("-1");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [userStripeId, setUserStripeId] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPlan, setUserPlan] = useState("");
    const [userPlanEndDate, setUserPlanEndDate] = useState("");
    const [userInvoiceUrl, setUserInvoiceUrl] = useState("");
    const [userCardBrand, setUserCardBrand] = useState("");
    const [userCardDigit, setUserCardDigit] = useState("");
    const [userCardExp, setUserCardExp] = useState("");

    const [showCardModal, setShowCardModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

    const handleCloseCardModal = () => setShowCardModal(false);
    const handleShowCardModal = () => setShowCardModal(true);
    const handleCloseAccountModal = () => setShowAccountModal(false);
    const handleShowAccountModal = () => setShowAccountModal(true);

    const stripePromise = loadStripe("pk_test_VtVbrLQ6xPiMm1pMmRVsiU1U");

    const cookies = new Cookies();
    const site = data.allGhostSettings.edges[0].node;
    const twitterUrl = site.twitter
        ? `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
        : null;
    const facebookUrl = site.facebook
        ? `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`
        : null;

    console.log(data);

    const allPosts = data.allGhostPost.edges;

    function userLogout() {
        cookies.remove("loggedInUser");
        cookies.remove("loggedInUserIpAddress");
        window.location.href = "/login";
    }

    function confirmPopUp() {
        confirmAlert({
            title: "Confirm to submit",
            message: "Are you sure, do you want to cancel your subscription?",
            buttons: [
                {
                    label: "Confirm",
                    onClick: () => cancelSubscription(),
                },
                {
                    label: "No",
                    onClick: () => "",
                },
            ],
        });
    }

    async function cancelSubscription() {
        //const userStripeId = "";
        await fetch("/.netlify/functions/cancel-subscription", {
            method: "POST",
            body: JSON.stringify({ userStripeId }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                alert(responseJson.message);
            });
    }

    useEffect(async () => {
        var id = "1f6d35dc-af10-11eb-8319-0242ac130002";
        var ci_search = document.createElement("script");
        ci_search.type = "text/javascript";
        ci_search.async = true;
        ci_search.src =
            "https://cse.expertrec.com/api/js/ci_common.js?id=" + id;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(ci_search, s);

        console.log(cookies.get("loggedInUser"));
        console.log(cookies.get("loggedInUserIpAddress"));
        const userEmail = cookies.get("loggedInUser");
        let customerStripeId = "";
        if (cookies.get("loggedInUser")) {
            await fetch("/.netlify/functions/get-user", {
                method: "POST",
                body: JSON.stringify({ userEmail }),
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (
                        responseJson.user[0].user_ip !==
                        cookies.get("loggedInUserIpAddress")
                    ) {
                        cookies.remove("loggedInUser");
                        cookies.remove("loggedInUserIpAddress");
                        setUserLoggedIn("0");
                    } else {
                        setUserLoggedIn("1");
                        setUserName(responseJson.user[0].user_name);
                        if (
                            responseJson.user[0].stripe_id &&
                            responseJson.user[0].plan_id !== "0"
                        ) {
                            setIsSubscribed(true);
                            setUserStripeId(responseJson.user[0].stripe_id);
                            setUserEmail(responseJson.user[0].user_email);
                            customerStripeId = await responseJson.user[0]
                                .stripe_id;
                            if (responseJson.user[0].plan_id == 1) {
                                setUserPlan("Pro");
                            } else {
                                setUserPlan("Premium");
                            }
                            console.log(
                                responseJson.user[0].user_subscription_end
                            );
                            const dt =
                                responseJson.user[0].user_subscription_end +
                                "000";
                            console.log(dt);

                            const monthNames = [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ];
                            const dateObj = new Date(parseInt(dt));
                            const month = monthNames[dateObj.getMonth()];
                            const day = String(dateObj.getDate()).padStart(
                                2,
                                "0"
                            );
                            const year = dateObj.getFullYear();
                            const output = month + " " + day + "," + year;
                            console.log(output);
                            setUserPlanEndDate(output);
                        }
                    }
                });

            console.log(customerStripeId);
            await fetch("/.netlify/functions/customer-payment-method", {
                method: "POST",
                body: JSON.stringify({ customerStripeId }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    setUserCardBrand(responseJson.data[0].card.brand);
                    setUserCardDigit(responseJson.data[0].card.last4);
                    setUserCardExp(
                        responseJson.data[0].card.exp_month +
                            ", " +
                            responseJson.data[0].card.exp_year
                    );
                });

            await fetch("/.netlify/functions/customer-invoices", {
                method: "POST",
                body: JSON.stringify({ customerStripeId }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data[0].hosted_invoice_url);
                    setUserInvoiceUrl(responseJson.data[0].hosted_invoice_url);
                });
        } else {
            setUserLoggedIn("0");
        }
    }, []);

    return (
        <>
            <Helmet>
                <html lang={site.lang} />
                <style type="text/css">{`${site.codeinjection_styles}`}</style>
                <body className={bodyClass} />
            </Helmet>

            <div className="viewport">
                <div className="viewport-top">
                    {/* The main header section on top of the screen */}
                    <header className="site-head">
                        <div className="container">
                            <nav className="site-nav">
                                <div className="site-nav-left">
                                    <Navigation
                                        data={site.navigation}
                                        navClass="site-nav-item"
                                    />
                                </div>
                                <div>
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link  dropdown-toggle"
                                            href="#"
                                            data-bs-toggle="dropdown"
                                        >
                                            {" "}
                                            All Chapters{" "}
                                        </a>
                                        <ul class="dropdown-menu">
                                            {allPosts.map(({ node }) => (
                                                <li>
                                                    <a
                                                        class="dropdown-item"
                                                        href={node.slug}
                                                    >
                                                        {node.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </div>
                                <ci-search></ci-search>
                                <div className="site-nav-right">
                                    {userLoggedIn == "0" ? (
                                        <Link
                                            className="site-nav-button"
                                            to="/login"
                                        >
                                            Login
                                        </Link>
                                    ) : userName ? (
                                        <Dropdown as={ButtonGroup}>
                                            <Button
                                                variant="secondary"
                                                className="account-btn"
                                            >
                                                {userName}
                                            </Button>
                                            <Dropdown.Toggle
                                                split
                                                variant="secondary"
                                                id="dropdown-split-basic"
                                                className="account-btn"
                                            />
                                            <Dropdown.Menu>
                                                {isSubscribed ? (
                                                    <div>
                                                        <Dropdown.Item
                                                            data-toggle="modal"
                                                            data-target="#exampleModal"
                                                        >
                                                            My Account
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={
                                                                confirmPopUp
                                                            }
                                                        >
                                                            Cancel Subscription
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            data-toggle="modal"
                                                            data-target="#changeCardModal"
                                                        >
                                                            Change Card
                                                        </Dropdown.Item>
                                                        <Dropdown.Divider />
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                <Dropdown.Item
                                                    onClick={userLogout}
                                                >
                                                    Logout
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </nav>
                        </div>
                    </header>

                    <main className="site-main">
                        {/* All the main content gets inserted here, index.js, post.js */}
                        {children}
                    </main>
                </div>
                <div
                    class="modal fade"
                    id="changeCardModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="changeCardModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5
                                    class="modal-title"
                                    id="changeCardModalLabel"
                                >
                                    Add Card
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <Elements stripe={stripePromise}>
                                    <CardSetupForm customerId={userStripeId} />
                                </Elements>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    My Account
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p className="detail-head">User Detail:</p>
                                <div class="row">
                                    <div class="col-md-6">Name: {userName}</div>
                                    <div class="col-md-6">
                                        Email: {userEmail}
                                    </div>
                                </div>
                                <p className="detail-head">
                                    Subscription Detail:
                                </p>
                                <div class="row">
                                    <div class="col-md-6">
                                        Current plan: {userPlan}
                                    </div>
                                    <div class="col-md-6">
                                        End date: {userPlanEndDate}
                                    </div>
                                </div>
                                <p className="detail-head">Card Detail:</p>
                                <div class="row">
                                    <div class="col-md-4">
                                        Brand: {userCardBrand}
                                    </div>
                                    <div class="col-md-4">
                                        Last 4 digits: {userCardDigit}
                                    </div>
                                    <div class="col-md-4">
                                        Exp date: {userCardExp}
                                    </div>
                                </div>
                                <p className="detail-head">Latest Invoice:</p>
                                <div class="row">
                                    <div class="col-md-12">
                                        <p>
                                            Click{" "}
                                            <a
                                                target="_blank"
                                                href={userInvoiceUrl}
                                            >
                                                here
                                            </a>{" "}
                                            to view latest invoice
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    isHome: PropTypes.bool,
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
};

const DefaultLayoutSettingsQuery = (props) => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                file(relativePath: { eq: "ghost-icon.png" }) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
                allGhostPost(sort: { order: DESC, fields: [published_at] }) {
                    edges {
                        node {
                            ...GhostPostFields
                        }
                    }
                }
            }
        `}
        render={(data) => <DefaultLayout data={data} {...props} />}
    />
);

export default DefaultLayoutSettingsQuery;
