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
    //Firebase variables
    var database = firebase.database();
    var auth = firebase.auth();

    //API variables
    var yelpAPIKey = "qusAduy05LdRpxfqStriSQS46iXpHS1hb_RHHF2HSqlGX5Xw6OMMZqlEkO4C_vb-BlUPl2v-BuP-gy6ek6kXrXCV8LpdQMLaY0wOkC3pFqCjz291AcMEf6hXHVfiWnYx"
    var yelpClientID = "ZYDpWatxChwhrIdoyZVlFg"
    //May not need Client ID for Yelp.
    var yelpURL = "https://api.yelp.com/v3/businesses/search"

    //login to Firebase
    function login() {
        var email = $("#email").val();
        var password = $("#password").val();
        var promise = auth.signInWithEmailAndPassword(email, password)
        console.log(promise)
        isUserSignedIn();
        promise.catch(function (error) {
            console.log(error.code);
            console.log(error.message);
        });
    };
    //checking if user is signedin
    function isUserSignedIn() {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                window.location.href = "home.html";
                console.log("User is signed in.")
            } else {
                console.log("No user is signed in.")
            };
        });
    };

    //logout and redirect to login screen
    function logout() {
        auth.signOut().then(function () {
            window.location.href = "index.html";
        }).catch(function (error) {
            // An error happened.
        });
    };
    //hide the create account when the page loads
    function onPageLoad() {
        $("#new-account").hide();
    };

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



        var promise = auth.createUserWithEmailAndPassword(email, password)
        console.log(promise)
        login();
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
        database.ref().set(newUser);

        //clear form
        clearForm();

    });

    //  Complete Travel Survey

    $("#start-journey").on("click", function (event) {
        // prevent page from refreshing when form tries to submit itself
        event.preventDefault();
        // Capture user inputs and store them into variables
        var tripName = $("#trip-name").val().trim();
        var myCity = $("#my-city").val().trim();
        var myState = $("#my-state").val().trim();
        var startPoint = myCity + " " + myState;
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        var destinationCity = $("#destination-city").val().trim();
        var destinationState = $("#destination-state").val().trim();
        var endPoint = destinationCity + " " + destinationState;
        var interests = $("#interests").val().trim();
        var interestsArray = interests.split(",");
        var budget = $("#budget").val().trim();
        var accommodations = [];
        $("#accommodations option:selected").each(function (i, selectedElement) {
            accommodations[i] = $(selectedElement).val();
        });

        // Creates local "temporary" object for holding new train data
        var newUser = {
            tripName: tripName,
            startPoint: startPoint,
            startDate: startDate,
            endDate: endDate,
            endPoint: endPoint,
            interestsArray: interestsArray,
            budget: budget,
            accommodations: accommodations,
            // travelMode: travelMode
        };

        // Push to database
        database.ref().set(newUser);

        //navigate to Itinerary page
        window.location.href = "itinerary-template.html";

        //clear form
        clearForm();
    });

    //click functions for login/logout and navigation
    $("body").on("click", "#sign-in", login).on("click", "#logout", logout).on("click", "#nav-button-Home", function () {
        window.location.href = "home.html";
    }).on("click", "#start", function () {
        window.location.href = "newTrip.html";
    }).on("click", "#sign-up-link", function () {
        $("#new-account").show();
        $("#sign-in-container").hide();
    });

    // Function to clear user input fields
    function clearForm() {
        $(".form-control").val("");
        $(".password").val("");
    };

    var driveTime = "";
    var driveDistance = "";
    var startAddress = "";
    var endAddress = "";
    var driveDetailsLabels = ["Your driving time is: ", "Your driving distance is: ", "Your start location is: ", "Your end location is: "];
    var startPointGlobal = "";
    var endPointGlobal = "";





    function myMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            // // center: startPointGlobal,
            // zoom: 7
        });

        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        });

        // Set destination, origin and travel mode.
        var request = {
            destination: endPointGlobal,
            origin: startPointGlobal,
            travelMode: 'DRIVING'
        };


        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                // response.routes[0].legs[0].duration.text
                // debugger;
                // Display the route on the map.

                driveTime = response.routes[0].legs[0].duration.text;
                console.log(driveTime);
                driveDistance = response.routes[0].legs[0].distance.text;
                startAddress = response.routes[0].legs[0].start_address;
                endAddress = response.routes[0].legs[0].end_address;

                var driveDetails = [driveTime, driveDistance, startAddress, endAddress];

                directionsDisplay.setDirections(response);

                displayDrivingDetails(driveDetails);
            }
        });
    }
    database.ref().on("value", function (snapshot) {
        console.log(snapshot);
        startPointGlobal = snapshot.val().startPoint;
        console.log(startPointGlobal);
        endPointGlobal = snapshot.val().endPoint;
        console.log(endPointGlobal);

        myMap(startPointGlobal, endPointGlobal)
    });

    var displayDrivingDetails = function (driveDetails) {

        for (i = 0; i < driveDetails.length; i++) {
            console.log("In driving div");
            var drivingDiv = $("<p>");
            drivingDiv.text(driveDetailsLabels[i] + driveDetails[i]);
            console.log(drivingDiv);
            $("#drivingDirectionsDetail").append(drivingDiv);
        };
    };

    var packingList = ["Shirts", "Passport", "Book"];

    database.ref().update({
        packingList: packingList,
    });

    function putOnPage(tempArray) {

        $("#packing-list").empty(); // empties out the html

        // render our insideList todos to the page
        for (var i = 0; i < tempArray.length; i++) {
            var p = $("<p>").text(tempArray[i]);
            var b = $("<button class='delete'>").text("x").attr("data-index", i);
            p.prepend(b);
            $("#packing-list").prepend(p);
        }
    }

    // Whenever a user clicks the submit-item button
    $("#submit-item").on("click", function (event) {
        console.log("Clicked");
        // Prevent form from submitting
        event.preventDefault();

        var tempArray = [];
        var val = $("input[type='text']").val();
        $("input[type='text']").val("");


        database.ref().on("value", function (snapshot) {
            tempArray = snapshot.val().packingList;
            console.log("TempArray = " + tempArray);
        });

        tempArray.push(val);
        console.log(tempArray);
        database.ref().update({
            packingList: tempArray,
        });

        putOnPage(tempArray);
    });

    database.ref().on("value", function (snapshot) {

        // If Firebase has a highPrice and highBidder stored (first case)
        if (snapshot.child("packingList").exists()) {

            tempArray = snapshot.val().packingList;
            console.log("In snapshot function " + tempArray);
            putOnPage(tempArray);

        }
        // Else if Firebase doesn't have a packingList. Currently no actions.
        else {}
        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // render our todos on page load
    putOnPage(packingList);

    $(document).on("click", "button.delete", function () {

        var currentIndex = $(this).attr("data-index");
        var tempArray = [];
        database.ref().on("value", function (snapshot) {
            tempArray = snapshot.val().packingList;
            console.log("TempArray in delete function= " + tempArray);
        });

        // Deletes the item marked for deletion
        tempArray.splice(currentIndex, 1);

        console.log("TempArray after splice " + tempArray);

        database.ref().update({
            packingList: tempArray,
        });

        putOnPage(tempArray);
    });

    onPageLoad()
});