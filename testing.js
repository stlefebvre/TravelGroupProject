$(document).ready(function () {

    var driveTime = "";
    var driveDistance = "";
    var startAddress = "";
    var endAddress = "";
    var driveDetailsLabels = ["Your driving time is: ","Your driving distance is: ","Your start location is: ","Your end location is: "];
    // var driveDetails = [driveTime,driveDistance,startAddress,endAddress];

    function myMap() {
        // var chicago = { lat: 41.85, lng: -87.65 };
        // var indianapolis = { lat: 39.79, lng: -86.14 };


        //     origins: Vancouver+BC|Seattle
        // destinations: San+Francisco|Victoria+BC

        var startPoint = "Seattle, WA";
        var endPoint = "San Francisco, CA";
        startPoint = "James and Jason's variable of th"

        var map = new google.maps.Map(document.getElementById('map'), {
            center: startPoint,
            zoom: 7
        });

        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        });

        // // Set destination, origin and travel mode.
        // var request = {
        //     destination: indianapolis,
        //     origin: chicago,
        //     travelMode: 'DRIVING'
        // };

        // Set destination, origin and travel mode.
        var request = {
            destination: endPoint,
            origin: startPoint,
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

                var driveDetails = [driveTime,driveDistance,startAddress,endAddress];

                directionsDisplay.setDirections(response);

                displayDrivingDetails(driveDetails);
            }
        });
    }

    myMap();




    var displayDrivingDetails = function(driveDetails) {

        for (i=0; i<driveDetails.length; i++) {
            console.log("In driving div");
            var drivingDiv = $("<p>");
            drivingDiv.text(driveDetailsLabels[i]+driveDetails[i]);
            console.log(drivingDiv);
            $("#drivingDirectionsDetail").append(drivingDiv);
        }
        

        // var b = $("<button class='delete'>").text("x").attr("data-index", i);
        // p.prepend(b);
        // $("#packing-list").prepend(p);
    }
    
    // displayDrivingDetails();







    // $(document).ready(function () {



    // Initialize Firebase (Shelby's Database)
    // var config = {
    //     apiKey: "AIzaSyD4_Txdc3EIf5gFvynL2TB4wvy4u-7szYg",
    //     authDomain: "grouptravelproject-2eaf6.firebaseapp.com",
    //     databaseURL: "https://grouptravelproject-2eaf6.firebaseio.com",
    //     projectId: "grouptravelproject-2eaf6",
    //     storageBucket: "grouptravelproject-2eaf6.appspot.com",
    //     messagingSenderId: "433773464016"
    //     };
    //     firebase.initializeApp(config);

    // <script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>

    // Initialize Firebase (Jashan's Database) - Jashan did not have access to Shelby's database so tested with his own database
    // var config = {
    //     apiKey: "AIzaSyD4_Txdc3EIf5gFvynL2TB4wvy4u-7szYg",
    //     authDomain: "grouptravelproject-2eaf6.firebaseapp.com",
    //     databaseURL: "https://grouptravelproject-2eaf6.firebaseio.com",
    //     projectId: "grouptravelproject-2eaf6",
    //     storageBucket: "grouptravelproject-2eaf6.appspot.com",
    //     messagingSenderId: "433773464016"
    // };
    // firebase.initializeApp(config);
    var database = firebase.database();

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
        else {
        }


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

});