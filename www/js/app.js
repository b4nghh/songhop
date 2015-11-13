angular.module('songhop', ['ionic', 'ngCordova', 'songhop.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('splash', {
    url: '/',
    templateUrl: 'templates/splash.html',
    controller: 'SplashCtrl',
    onEnter: function($state, User) {
      User.checkSession().then(function(hasSession) {
        if (hasSession) $state.go('tab.discover');
      });
    }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl',
    // don't load the state until we've populated our User, if necessary.
    resolve: {
      populateSession: function(User) {
        return User.checkSession();
      }
    },
    onEnter: function($state, User) {
      User.checkSession().then(function(hasSession) {
        if (!hasSession) $state.go('splash');
      });
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        templateUrl: 'templates/discover.html',
        controller: 'DiscoverCtrl'
      }
    }
  })

  .state('tab.favorites', {
    url: '/favorites',
    views: {
      'tab-favorites': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})

.constant('SERVER', {
  url: 'https://ionic-songhop.herokuapp.com'
});
