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
        isUserSignedIn();
        promise.catch(function (error) {});
    };
    //checking if user is signedin
    function isUserSignedIn() {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                window.location.href = "home.html";
            };
        });
    };

    //logout and redirect to login screen
    function logout() {
        auth.signOut().then(function () {
            window.location.href = "index.html";
        }).catch(function (error) {});
    };

    //hide the create account when the page loads
    function onPageLoad() {
        $("#new-account").hide();
    };

    onPageLoad();
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
        login();
        promise.catch(function (error) {});

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
        var destCity = $("#destination-city").val().trim();
        var destState = $("#destination-state").val().trim();
        // var endPoint = destinationCity + " " + destinationState;
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
            destCity: endDate,
            destState: destState,
            destCity: destCity,
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

    //function for Google Maps
    function myMap() {

        var map = new google.maps.Map(document.getElementById('map'), {});

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
                // Display the route on the map.

                driveTime = response.routes[0].legs[0].duration.text;
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
        startPointGlobal = snapshot.val().startPoint;
        destCity = snapshot.val().destCity
        destState = snapshot.val().destState;
        endPointGlobal = destCity + destState;
        myMap(startPointGlobal, endPointGlobal)
    });

    var displayDrivingDetails = function (driveDetails) {

        for (i = 0; i < driveDetails.length; i++) {
            var drivingDiv = $("<p>");
            drivingDiv.text(driveDetailsLabels[i] + driveDetails[i]);
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
        // Prevent form from submitting
        event.preventDefault();

        var tempArray = [];
        var val = $("input[type='text']").val();
        $("input[type='text']").val("");


        database.ref().on("value", function (snapshot) {
            tempArray = snapshot.val().packingList;
        });

        tempArray.push(val);
        database.ref().update({
            packingList: tempArray,
        });

        putOnPage(tempArray);
    });

    database.ref().on("value", function (snapshot) {

        // If Firebase has a highPrice and highBidder stored (first case)
        if (snapshot.child("packingList").exists()) {

            tempArray = snapshot.val().packingList;
            putOnPage(tempArray);

        }
        // Else if Firebase doesn't have a packingList. Currently no actions.
        else {}
        // If any errors are experienced, log them to console.
    }, function (errorObject) {});

    // render our todos on page load
    putOnPage(packingList);

    $(document).on("click", "button.delete", function () {

        var currentIndex = $(this).attr("data-index");
        var tempArray = [];
        database.ref().on("value", function (snapshot) {
            tempArray = snapshot.val().packingList;
        });

        // Deletes the item marked for deletion
        tempArray.splice(currentIndex, 1);
        database.ref().update({
            packingList: tempArray,
        });

        putOnPage(tempArray);
    });

    //Yelp api
    $("#activitiesButton").on("click", function(event) {
        $("#activities").show();
    });
    $("#hotelsButton").on("click", function(event) {
        $("#hotels").show();
    });

    var term = "";
    var destCity = "";
    var destState = "";
    var budget = "";


    database.ref().on("value", function (snapshot) {
        term = snapshot.val().interestsArray;
        destCity = snapshot.val().destCity;
        destState = snapshot.val().destState;
        budget = parseInt(snapshot.val().budget);
        hotelSearch()
    });

    function hotelSearch() {
        var location = destCity + ", " + destState;
        var url = "https://fast-ridge-58490.herokuapp.com/yelp/search?term=" + term + "&price=" + "&location=" + location + "&radius=16093&limit=10"

        //AJAX for hotels
        var hotelSearch = {
            "async": true,
            "crossDomain": true,
            "url": "https://fast-ridge-58490.herokuapp.com/yelp/search?term=hotel&location=" + location + "&radius=16093&limit=10",
            "method": "GET"
        }

        $.ajax(hotelSearch).done(function (response) {
            var businesses = response.businesses;
            //List set outside of the function so that it can be called for multiple loops
            var hotelList = $("<ul>")

            for (var i = 0; i < businesses.length; i++) {
                var hotelListItem = $("<li>");
                hotelListItem.append("<p> Hotel Name: " + businesses[i].name + "</p>");
                hotelListItem.append("<p> Street: " + businesses[i].location.display_address[0] + "</p>");
                hotelListItem.append("<p> City, State: " + businesses[i].location.display_address[1] + "</p>");
                hotelListItem.append("<p> Phone Number: " + businesses[i].phone + "</p>");
                hotelListItem.append("<p> Web Address: " + businesses[i].url + "</p>");

                hotelList.append(hotelListItem);
                $("#hotels").append(hotelList)
                //build a div with id of hotels
            };
        });


        //AJAX for things to do
        var businessSearch = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET"
        }

        $.ajax(businessSearch).done(function (response) {
            var businesses = response.businesses;
            //List set outside of the function so that it can be called for multiple loops

            var list = $("<ul>")

            for (var i = 0; i < businesses.length; i++) {
                var listItem = $("<li>");
                listItem.append("<p> Business Name: " + businesses[i].name + "</p>");
                listItem.append("<p> Street: " + businesses[i].location.display_address[0] + "</p>");
                listItem.append("<p> City, State: " + businesses[i].location.display_address[1] + "</p>");
                listItem.append("<p> Phone Number: " + businesses[i].phone + "</p>");
                listItem.append("<p> Web Address: " + businesses[i].url + "</p>");

                list.append(listItem);
                $("#activities").append(list)
                //build a div with id of activities
            };
        });
    };
     
    $.ajax(businessSearch).done(function (response) {
        var businesses = response.businesses;
        //List set outside of the function so that it can be called for multiple loops
        
        var list = $("<ul class='business-list'>")

        for (var i = 0; i < businesses.length; i++) {
            var listItem = $("<li class='business-items'>");
            listItem.append("<p class='business-info'> <strong>Business Name:</strong> " + businesses[i].name + "</p>");
            listItem.append("<p class='business-info'> <strong>Street:</strong> " + businesses[i].location.display_address[0] + "</p>");
            listItem.append("<p class='business-info'>&#8195;&#8195;&#8195; " + businesses[i].location.display_address[1] + "</p>");
            listItem.append("<p class='business-info'> <strong>Phone Number:</strong> " + businesses[i].phone + "</p>");

            list.append(listItem);
            $("#activities").append(list).hide();
            //build a div with id of activities
        };
    });
};
        var tripName, startPoint, startDate, endDate, travelDates, destCity, deststate, endPoint, interestsArray, budget;
        database.ref().on("value", function (snapshot) {
            $(".trip-overview").empty();
            tripName = snapshot.val().tripName;
            startPoint = snapshot.val().startPoint;
            startDate = snapshot.val().startDate;
            endDate = snapshot.val().endDate;
            travelDates = startDate + " " + endDate;
            destCity = snapshot.val().destCity;
            destState = snapshot.val().destState;
            endPoint = destCity + " " + destState;
            interestsArray = snapshot.val().interestsArray;
            $("#trip-name").append(tripName);
            $("#starting-point").append(startPoint);
            $("#travel-dates").append(travelDates);
            $("#destination").append(endPoint);
            $("#interests").append(interestsArray.toString());
        });
  

});