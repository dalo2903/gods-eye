var app = angular.module('GodsEye')

app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  apiService.getNotification(_id)
    .then(function (res) {
      $scope.notification = res.data.notification
      $scope.foo = true
      // https://stackoverflow.com/a/38107284
    })
    .catch(function (res) {
    })
}])
