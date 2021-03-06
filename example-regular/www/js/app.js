// Noodlio Pay
// Example with Noodlio Pay API (Option 1)

// ---------------------------------------------------------------------------------------------------------
// !important settings
// Please fill in the following constants to get the project up and running
// You might need to create an account for some of the constants.

// Obtain your unique Mashape ID from here:
// https://market.mashape.com/noodlio/noodlio-pay-smooth-payments-with-stripe
var NOODLIO_PAY_API_URL         = "https://noodlio-pay.p.mashape.com";
var NOODLIO_PAY_API_KEY         = "<YOUR-UNIQUE-MASHAPE-ID>";

// Obtain your unique Stripe Account Id from here:
// https://www.noodl.io/pay/connect
// Please also connect your account on this address
// https://www.noodl.io/pay/connect/test
var STRIPE_ACCOUNT_ID           = "<YOUR-UNIQUE-STRIPE-ID>";

// Define whether you are in development mode (TEST_MODE: true) or production mode (TEST_MODE: false)
var TEST_MODE = true;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})


.controller('ExampleCtrl', ['$scope', '$http', function($scope, $http) {

  
  // add the following headers for authentication
  $http.defaults.headers.common['X-Mashape-Key']  = NOODLIO_PAY_API_KEY;
  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
  $http.defaults.headers.common['Accept']         = 'application/json';
  
  $scope.FormData = {
    number: "4242424242424242",
    cvc: "256",
    exp_month: "08",
    exp_year: "2018",
    test: TEST_MODE, 
  };
  
  $scope.createToken = function() {
    
    // init for the DOM
    $scope.ResponseData = {
      loading: true
    };
    
    // create a token and validate the credit card details
    $http.post(NOODLIO_PAY_API_URL + "/tokens/create", $scope.FormData)
    .success(
      function(response){
        
        // --> success
        console.log(response)
        
        if(response.hasOwnProperty('id')) {
          var token = response.id; $scope.ResponseData['token'] = token;
          proceedCharge(token);
        } else {
          $scope.ResponseData['token'] = 'Error, see console';
          $scope.ResponseData['loading'] = false;
        };

      }
    )
    .error(
      function(response){
        console.log(response)
        $scope.ResponseData['token'] = 'Error, see console';
        $scope.ResponseData['loading'] = false;
      }
    );
  };
  
  // charge the customer with the token
  function proceedCharge(token) {
    
    var param = {
      source: token,
      amount: 100,
      currency: "usd",
      description: "Your custom description here",
      stripe_account: STRIPE_ACCOUNT_ID,
      test: TEST_MODE,
    };
    
    $http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
    .success(
      function(response){
        
        // --> success
        console.log(response);
        $scope.ResponseData['loading'] = false;
        
        if(response.hasOwnProperty('id')) {
          var paymentId = response.id; $scope.ResponseData['paymentId'] = paymentId;
        } else {
          $scope.ResponseData['paymentId'] = 'Error, see console';
        };
        
      }
    )
    .error(
      function(response){
        console.log(response)
        $scope.ResponseData['paymentId'] = 'Error, see console';
        $scope.ResponseData['loading'] = false;
      }
    );
  };
  
}]);