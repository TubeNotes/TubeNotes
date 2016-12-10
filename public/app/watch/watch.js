angular.module('tubenotes.watch', [])

.controller('WatchController', function($scope, $sce, $interval, AppFactory) {
  var intervalPromise;
  $scope.currentVideoTime = '00:00';
  $scope.currentVideoId = (AppFactory.currentVideo) ? 'dQw4w9WgXcQ': AppFactory.currentVideo.id;

  window.onYouTubeIframeAPIReady = function() {
    console.log('CALLED');
    window.player = new YT.Player('player', {
      width: '800',
      height: '450',
      videoId: AppFactory.currentVideo.id || 'dQw4w9WgXcQ',
      events: {
        // 'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  window.onPlayerStateChange = function(event) {
    // if video is playing, update 
    if (event.data === YT.PlayerState.PLAYING) {
      // set video to current time
      var seconds = Math.floor(player.getCurrentTime());
      $scope.currentVideoTime = $scope.formatTime(seconds);
      // set interval for time setting
      intervalPromise = $interval(() => 
        ($scope.currentVideoTime = $scope.formatTime(Math.floor(player.getCurrentTime())))
      , 100);
    } else if (event.data === YT.PlayerState.ENDED || 
       event.data === YT.PlayerState.PAUSED) {
      $interval.cancel(intervalPromise);
    }
  }

  $scope.formatTime = function(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;

    minutes = (minutes < 10) ? `0${minutes}`:`${minutes}`;
    seconds = (seconds < 10) ? `0${seconds}`:`${seconds}`;

    return `${minutes}:${seconds}`
  }

  $scope.postNote = function(title, note) {
    // post note to server
    var newNote = { user: username,
                    title: title,
                    note: note };
    AppFactory.addNote(newNote);
  }

  $scope.getUrl = function() {
    var currentVideoUrl = "htttps://www.youtube.com/embed/" + videoId;
    
    console.log('GET URL CALLED', currentVideoUrl);
    window.player = new YT.Player('player', {
      width: '800',
      height: '450',
      videoId: $sce.trustAsResourceUrl(currentVideoUrl),
      events: {
        // 'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    
    return $sce.trustAsResourceUrl(currentVideoUrl);
  }

  $scope.updateVideo = function() {

  }

  $scope.getVideoTime = function() {
    if (window.player){
      return window.player.getCurrentTime();
    } else {
      return 0;
    }
  }
});