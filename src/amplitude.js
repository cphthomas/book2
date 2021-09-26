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
                    "https://storage.googleapis.com/tepedu/podcastimage/giphy_1_rrpccq.gif"
                );
            } else {
                $(this).attr(
                    "src",
                    "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg"
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
                    "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg"
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
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/1._intro.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "2 Variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/2._Variable.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "3. Beskrivende statistik",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/3._Beskrivende_statistik.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "4. Normalfordelingen",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/4._Normalfordelingen.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "5. Konfidensintervaller kvantitative variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/5._Konfidensintervaller_kvantitative_variable.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "6.0 Hypotesetests kvantitative variable",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/6.0._Hypotesetests_kvantitative_variable.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "6.1 Type 1 og type 2 fejl",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/6.1_Type_1_og_type_2_fejl.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "7.0 Konfidensinterval 1 andel",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/7.0_Konfidensinterval_1_andel.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "7.1 Test 1 andel",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/7.1_Test_1_andel.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "8. Test af 2 andele",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/8._Test_af_2_andele.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "9. Test af 2 middelværdier",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/9._Test_af_2_middelv%C3%A6rdier.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "10. Korrelation",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/10._Korrelation.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "11.1 Simpel lineær regression",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/11.1_Simpel_line%C3%A6r_regression.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "11.2 Multipel lineær regression",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/11.2_Multipel_line%C3%A6r_regression.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "11.3 Lineær regression forudsaetninger",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/11.3_Line%C3%A6r_regression_foruds%C3%A6tninger.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "15 Stikprøveudvælgelse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/15._Stikpr%C3%B8veudv%C3%A6lgelse.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "17.1 Chi i anden tests",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/17.1_Chi_i_anden_tests.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "17.2 Goodness of fit tests",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/17.2_Goodness_of_fit_test.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "18 Anova",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/18._ANOVA.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "20 Faktoranalyse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/20._Faktoranalyse.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "21 Klyngeanalyse",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/21._Klyngeanalyse.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                    {
                        name: "22 ARIMA",
                        artist: "Thomas Petersen",
                        album: "Statistik",
                        url:
                            "https://storage.googleapis.com/tepedu/statistik_podcasts/22._ARIMA.m4a",
                        cover_art_url:
                            "https://storage.googleapis.com/tepedu/podcastimage/spole_aelus7.jpg",
                    },
                ],
            },
        },
    });
}

export default amplitudeJS;
