var app = angular.module('GodsEye')
app.controller('headerController', ['$scope', 'apiService', function ($scope, apiService) {
  const userId = $('#user_id').text().trim()
  if (userId) {
    apiService.getUserNotifications(userId)
      .then(function (res) {
        $scope.notifications = res.data.notifications
      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
