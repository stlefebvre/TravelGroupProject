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
 
    $("body").on("click", "#btnLogin", function (){
      var email = $("#user-email").val();
      var password = $("#password").val();
     var promise = auth.signInWithEmailAndPassword(email, password)
     console.log(promise)
     promise.catch(function(error) {
         console.log(error.code);
         console.log(error.message);
      });
      });
    
    $("body").on("click", "#btnSignUp", function (){
        var email = $("#user-email").val();
        var password = $("#password").val();
      var promise = auth.createUserWithEmailAndPassword(email, password)
      console.log(promise)
      promise.catch(function(error) {
             console.log(error.code);
             console.log(error.message);
          });
          });

})