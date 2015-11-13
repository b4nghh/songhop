angular.module('songhop.controllers', ['ionic', 'ngCordova', 'songhop.services'])

.controller('SplashCtrl', function($scope, $state, User) {
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function() {
      $state.go('tab.discover');
    }, function() {
      alert('Hmm... try another username.');
    });
  }
})

.controller('TabsCtrl', function($scope, $window, User, Recommendations) {
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

  $scope.favCount = User.favoriteCount;

  $scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = '/';
  }
})

.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-load-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  showLoading();

  Recommendations.init()
    .then(function() {
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();
      hideLoading();
      $scope.currentSong.loaded = true;
    });

  $scope.sendFeedback = function(bool) {
    if (bool) {
      User.addSongToFavorites($scope.currentSong);
    }
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    Recommendations.nextSong();

    $timeout(function() {
      // $timeout to allow animation to complete before changing to next song

      // update current song in scope
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;

    }, 250);

    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;
    });
  }

  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_lager;
    }
    return '';
  }
})

.controller('FavoritesCtrl', function($scope, $window, $timeout, $cordovaSocialSharing, $ionicActionSheet, $ionicPlatform, User) {
  $scope.username = User.username;
  $scope.favorites = User.favorites;

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }

  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }

  $scope.shareAction = function(song) {
    // Show the action sheet
    $cordovaSocialSharing
      .share("This is your message", "This is your subject", "www/img/ionic.png", song.open_url) // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occured. Show a message to the user
      });

  };
});
