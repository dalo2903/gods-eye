var app = angular.module('GodsEye')

app.controller('NewsFeedController', ['$scope', 'apiService', '$http', '$window', function ($scope, apiService, $http, $window) {
  apiService.getUserProfile()
    .then(function (res) {
      $scope.user = res.data.user
    })
    .catch(function (res) {
      console.log(res)
    })
  $scope.scrollData = []
  $scope.userId = $('#user_id').text().trim()
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
    $scope.block = false
    $scope.$apply()
  }
  $scope.postDetail = function (id) {
    $window.location.href = '/post/' + id;
  }
  $scope.report = function (postId) {
    var check = confirm("Report post for rules violation?");
    if (check == true) {
      $http({
        method: 'put',
        url: '/api/post/' + postId + '/report'
      }).then(function successCallback(response) {
        $('#reportButton' + postId).attr("disabled", "disabled");
        $('#reportButton' + postId).removeClass('btn-danger')
        $('#reportButton' + postId).html('Reported')
      }, function errorCallback(response) {
        console.log(response)
      });
    }
  }
  $scope.isReported = function (reported, postId) {
    if (reported.includes($scope.userId)) {
      $('#reportButton' + postId).attr("disabled", "disabled");
      $('#reportButton' + postId).removeClass('btn-danger')
      $('#reportButton' + postId).html('Reported')
      return true
    }
  }
  $scope.UserLogged = function (){

  }
}
])
