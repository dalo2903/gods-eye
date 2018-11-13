var app = angular.module('GodsEye')
app.controller('headerController', ['$scope', 'apiService', function ($scope, apiService) {
  const userId = $('#user_id').text().trim()
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

  $scope.loadMoreNotification = async function (firstTime) {
    if (userId) {
      $scope.block = true
      last = $scope.notifications.length - 1
      const response = await apiService.getAllUserNotifications(userId, last + 1, 5)
      const newNotifications = response.data.notifications
      $scope.notifications = $scope.notifications.concat(newNotifications)
      $scope.notifications = unique($scope.notifications)
      // console.log($scope.notifications.length)
      if (response.data.haveUnseenNotification) $('.bell-notification').css({ 'color': 'orangered' })
      else $('.bell-notification').css({ 'color': 'unset' })

      if (!firstTime) $scope.seenAllNotifications()
      $scope.block = false
      $scope.$apply()
      console.log('load more notification')
    }
  }
  $scope.loadMoreNotification(true)
  $scope.notiDetail = function (notiId) {
    apiService.setSeenNotification(notiId)
    window.location.replace('/notification/' + notiId)
  }

  $scope.seenAllNotifications = async function () {
    await apiService.seenAllNotifications(userId)
    $scope.notifications.forEach(element => {
      element.seen = true
    })
    $scope.$apply()
    return $('.bell-notification').css({ 'color': 'unset' })
  }
}])

if (md.mobile()) {
  $('#notification-dropdown').hide()
  $('#notification-mobile').show()
} else {
  $('#notification-dropdown').show()
  $('#notification-mobile').hide()
}
