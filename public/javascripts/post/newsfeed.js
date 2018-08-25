var app = angular.module('GodsEye')

app.controller('NewsFeedController', ['$scope', 'apiService', '$http', function ($scope, apiService, $http) {
  $http({
    method: 'GET',
    url: '/api/post'
  }).then(function success(response) {
    posts = response.data.posts
    $scope.scrollData = []
    for (var i = 0; i < 2; i++) {
      $scope.scrollData.push(posts[i])
    }
    $scope.loadMore = function () {
      last = $scope.scrollData.length - 1
      for (var i = last + 1; i < last + 3; i++) {
        $scope.scrollData.push(posts[i])
      }
    }
  }, function error(response) {
    console.log(response)
  })
}])
