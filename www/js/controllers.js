angular.module('songhop.controllers', ['ionic', 'songhop.services'])

.controller('TabsCtrl', function($scope, Recommendations) {
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
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

.controller('FavoritesCtrl', function($scope, User) {
  $scope.favorites = User.favorites;

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }
});
