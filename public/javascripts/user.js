var app = angular.module('GodsEye')

app.controller('UserController', ['$scope', 'apiService', function ($scope, apiService) {
  const userId = $('#user_id').text().trim()
  apiService.getPersons()
    .then(function (res) {
      $scope.persons = res.data.persons
    })
    .catch(function (res) {
      console.log(res)
    })

  apiService.getPostsSameUserCreated(userId)
    .then(function (res) {
      $scope.posts = res.data.posts
    })
    .catch(function (res) {
      console.log(res)
    })
  // Get noti
  $scope.notifications = []
  let last = 0
  $scope.block = false

  function unique (a) {
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

  $scope.loadMoreNotification = async function () {
    if (userId) {
      $scope.block = true
      last = $scope.notifications.length - 1
      const newNotifications = (await apiService.getAllUserNotifications(userId, last + 1, 5)).data.notifications
      $scope.notifications = $scope.notifications.concat(newNotifications)
      $scope.notifications = unique($scope.notifications)
      // console.log($scope.notifications.length)
      $scope.block = false
      $scope.$apply()
      console.log('load more notification')
    }
  }

  $scope.goToEditPage = function (id) {
    window.location.replace('/post/edit/' + id)
  }

  $scope.deletePost = function (_id, $index) {
    apiService.deletePost(_id)
      .then(function (res) {
        $scope.posts.splice($index, 1)
      })
      .catch(function (res) {
        alert(res.data.message)
      })
  }
}])
