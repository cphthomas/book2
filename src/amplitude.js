const amplitudeJS = () => {
    waitForElement("#white-player-playlist-container", 8000)
        .then(function () {
            console.log(
                "white-player-playlist-container element is loaded.. do stuff"
            );
            amplitudePlayerScript();
        })
        .catch(() => {
            console.log(
                "white-player-playlist-container element did not load in 8 seconds"
            );
        });
};

function waitForElement(querySelector, timeout = 0) {
    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            if (document.querySelector(querySelector)) {
                clearInterval(timer);
                resolve();
            } else if (timeout && now - startTime >= timeout) {
                clearInterval(timer);
                reject();
            }
        }, 100);
    });
}

function amplitudePlayerScript() {
    /* one single image for all playlist & change image on play pause*/
    $(document).on("click", ".amplitude-playing", function () {
        var playlist = $(this).data("amplitude-playlist");
        var imgTags = $(".main-album-art");
        $(imgTags).each(function (index) {
            var imgTagData = $(this).data("amplitude-playlist");
            if (imgTagData == playlist) {
                $(this).attr(
                    "src",
                    "http://docs.google.com/uc?export=open&id=114iX14rGzeY-uPvJ388dqksId2eKrUSV"
                );
            } else {
                $(this).attr(
                    "src",
                    "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd"
                );
            }
        });
    });
    $(document).on("click", ".amplitude-paused", function () {
        var playlist = $(this).data("amplitude-playlist");
        var imgTags = $(".main-album-art");
        $(imgTags).each(function (index) {
            var imgTagData = $(this).data("amplitude-playlist");
            if (imgTagData == playlist) {
                $(this).attr(
                    "src",
                    "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd"
                );
            }
        });
    });

    document
        .getElementsByClassName("show-playlist")[0]
        .addEventListener("click", function () {
            document
                .getElementById("white-player-playlist-container")
                .classList.remove("slide-out-top");
            document
                .getElementById("white-player-playlist-container")
                .classList.add("slide-in-top");
            document.getElementById(
                "white-player-playlist-container"
            ).style.display = "block";
        });

    document
        .getElementsByClassName("close-playlist")[0]
        .addEventListener("click", function () {
            document
                .getElementById("white-player-playlist-container")
                .classList.remove("slide-in-top");
            document
                .getElementById("white-player-playlist-container")
                .classList.add("slide-out-top");
            document.getElementById(
                "white-player-playlist-container"
            ).style.display = "none";
        });

    document
        .getElementById("speedTextPlayer3")
        .addEventListener("click", function () {
            var currentInnerText = parseFloat(
                document.getElementById("speedUpText3").innerHTML
            );
            console.log(currentInnerText);
            if (currentInnerText == 1) {
                document.getElementById("speedUpText3").innerHTML = "1.5";
            } else if (currentInnerText == 1.5) {
                document.getElementById("speedUpText3").innerHTML = "2";
            } else if (currentInnerText == 2) {
                document.getElementById("speedUpText3").innerHTML = "1";
            }
        });

    Amplitude.init({
        songs: [
            {
                name: "Sang alene",
                artist: "Sang alene",
                album: "Soon It Will Be Cold Enough",
                url: "https://521dimensions.com/song/FirstSnow-Emancipator.mp3",
                cover_art_url:
                    "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
            },
        ],
        playlists: {
            statpodcasts: {
                songs: [
                    {
                        name: "1. Intro",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1YG4iwCN4GIDdw0tbSZo6ZlvCj-CR5Kc0",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "2 Variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1s3HeeBjaM_6MoRo0VFv7Q4PvGfzsCr-e",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "3. Beskrivende statistik",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1mZ5igoYnFqjYvkblh5mq1A0A4p54kGLi",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "4. Normalfordelingen",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1K_a24l3mHBgyq9eo2m2ugIk8ZGxhbLO6",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "5. Konfidensintervaller kvantitative variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1uHyvpZvOKvrysd9TyLIrtnvEmUKK3wjZ",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "6.0 Hypotesetests kvantitative variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1_Jpu1K7eDMklw2GbZZmr7Vf8KXnQopgV",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "6.1 Type 1 og type 2 fejl",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1i4DTXCQZzrDNSbPi8NNPsv9gQqf0Gc_f",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "7.0 Konfidensinterval 1 andel",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1kIJRQ_it0vHNwk-CkKuHGChqBg6HDqHi",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "7.1 Test 1 andel",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1xh4eECOvDnEMj9htaFsBh4yPEZxEGS0M",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "8. Test af 2 andele",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=16o1mEht2h5vk5E8lJ9GXhNvjYJdRCMrY",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "9. Test af 2 middelværdier",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1jsfzgX55eZF8i0AMMLNwLPzCffInmGqU",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "10. Korrelation",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1uWhwQlCfCT3-u3HsxrMD5UO2Gu7gK7IC",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "11.1 Simpel lineær regression",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1dJlhLS5h_-LWAOcumHH7d-neYRl3Qga8",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "11.2 Multipel lineær regression",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1ot4JcfVROcUDikgF7WgRxIBHsP2YmuXz",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "11.3 Lineær regression forudsaetninger",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1xKp09ikKxU1VVoLelqcQdkbl1JjL6r_R",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "15 Stikprøveudvælgelse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1AgJgiLyRgjOWtLnUQZTRyDEptxcuCVtZ",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "17.1 Chi i anden tests",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1C0PTaDWWaiQ6L3a6BHsmney0zdGKpSIl",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "17.2 Goodness of fit tests",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1UahFaSHzAQKEtxejMPVMTqVAhYngRj4I",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "18 Anova",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1rGdjizrtY3O9X_6tSYrYmgwH84KJWzSx",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "20 Faktoranalyse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1G_2SymzoqlEQYY48--0l_rXDth1_oQnF",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "21 Klyngeanalyse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1iHoohUsS0z0wyVG8J21rQLNChqKO7muN",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                    {
                        name: "22 ARIMA",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "http://docs.google.com/uc?export=open&id=1YMY92TTQBO4Wtgw_x4YaS0ltv2RjHYe4",
                        cover_art_url:
                            "http://docs.google.com/uc?export=open&id=111d2e_oa2FrnfRhQVs3rC9l_LLu8i3Wd",
                    },
                ],
            },
        },
    });
}

export default amplitudeJS;
