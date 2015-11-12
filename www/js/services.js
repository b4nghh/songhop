angular.module('songhop.services', [])

.factory('User', function() {
  var o = {
    favorites: [],
    newFavorites: 0
  }

  o.addSongToFavorites = function(song) {
    if (!song) return false;

    o.favorites.unshift(song);
  }

  o.removeSongFromFavorites = function(song, index) {
    if (!song) return false;

    o.favorites.splice(index, 1);
  }

  return o;
})

.factory('Recommendations', function($http, $q, SERVER) {
  var o = {
    queue: []
  }

  var media;

  o.init = function() {
    if (o.queue.length == 0) {
      return o.getNextSongs();
    } else {
      return o.playCurrentSong();
    }
  }

  o.getNextSongs = function() {
    return $http({
      method: 'GET',
      url: SERVER.url + '/recommendations'
    }).success(function(data) {
      o.queue = o.queue.concat(data);
    })
  }

  o.nextSong = function() {
    // pop the index 0 off
    o.queue.shift();

    // end the song
    o.haltAudio();

    if (o.queue.length <= 3) {
      o.getNextSongs();
    }
  }

  o.playCurrentSong = function() {
    var defer = $q.defer();

    // play the current song's preview
    media = new Audio(o.queue[0].preview_url);

    // when song loaded, resolve the promise to let controller know.
    media.addEventListener("loadeddata", function() {
      defer.resolve();
    });

    media.play();

    return defer.promise;
  }

  // used when switching to favorites tab
  o.haltAudio = function() {
    if (media) media.pause();
  }

  return o;
});
