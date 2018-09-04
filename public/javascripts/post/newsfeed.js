var app = angular.module('GodsEye')

app.controller('NewsFeedController', ['$scope', 'apiService', '$http', function ($scope, apiService, $http) {
  $scope.scrollData = []
  let last = 0
  $scope.block = false
  function unique(a) {
    var seen = {}
    var out = []
    var len = a.length
    var j = 0
    for (var i = 0; i < len; i++) {
      var item = a[i]._id
      if (seen[item] !== 1) {
        seen[item] = 1
        out[j++] = a[i]
      }
    }
    return out
  }
  $scope.loadMore = async function () {
    $scope.block = true
    last = $scope.scrollData.length - 1
    const newPosts = (await apiService.getPosts(last + 1, 5)).data.posts
    // for (var i = last + 1; i < last + 3; i++) {
    //   $scope.scrollData.push(posts[i])
    // }
    $scope.scrollData = $scope.scrollData.concat(newPosts)
    $scope.scrollData = unique($scope.scrollData)
    console.log($scope.scrollData.length)
    $scope.block = false
    $scope.$apply()
  }
}
])
