$(document).ready(function () {
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyD4_Txdc3EIf5gFvynL2TB4wvy4u-7szYg",
                authDomain: "grouptravelproject-2eaf6.firebaseapp.com",
                databaseURL: "https://grouptravelproject-2eaf6.firebaseio.com",
                projectId: "grouptravelproject-2eaf6",
                storageBucket: "grouptravelproject-2eaf6.appspot.com",
                messagingSenderId: "433773464016"
            };
            firebase.initializeApp(config);


            //API variables
            var yelpAPIKey = "qusAduy05LdRpxfqStriSQS46iXpHS1hb_RHHF2HSqlGX5Xw6OMMZqlEkO4C_vb-BlUPl2v-BuP-gy6ek6kXrXCV8LpdQMLaY0wOkC3pFqCjz291AcMEf6hXHVfiWnYx"
            var yelpClientID = "ZYDpWatxChwhrIdoyZVlFg"
            //May not need Client ID for Yelp.
            var yelpURL = "https://api.yelp.com/v3/businesses/search"

            var googleMapAPIKey = "AIzaSyBztLFObJ_vMG1zhWlzys8DWeiONElq2EI"

            var auth = firebase.auth();

            function loginToFirebase() {
                var email = $("#user-email").val();
                var password = $("#password").val();
                var promise = auth.signInWithEmailAndPassword(email, password)
                console.log(promise)
                isUserSignedIn();
                promise.catch(function (error) {
                    console.log(error.code);
                    console.log(error.message);
                });
            };
        });
        //=============================================================================================  
        // New user account
        $("#create-account").on("click", function (event) {
            // prevent page from refreshing when form tries to submit itself
            event.preventDefault();

            // Capture user inputs and store them into variables
            var firstName = $("#first-name").val().trim();
            var lastName = $("#last-name").val().trim();
            var email = $("#user-email").val().trim();
            var phoneNumber = $("#phone-number").val().trim();
            var password = $("#pass-word").val().trim();
            var confirmPassword = $("#confirm-password").val().trim();

            var promise = auth.createUserWithEmailAndPassword(email, password)
            console.log(promise)
            
            promise.catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            });

            // Creates local "temporary" object for holding new train data
            var newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                password: password
            };

            // Push to database
            database.ref().push(newUser);


            function isUserSignedIn() {
                auth.onAuthStateChanged(function (user) {
                    if (user) {

                        window.location.href = "newTrip.html";
                        console.log("User is signed in.")
                    } else {
                        console.log("No user is signed in.")
                    }
                });
            };

            $("body").on("click", "#btnLogin", loginToFirebase);

        });