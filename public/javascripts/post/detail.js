var app = angular.module('GodsEye')

app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  apiService.getPost(_id)
    .then(function (res) {
      $scope.post = res.data.post
    })
    .catch(function (res) {
      console.log(res)
    })
}])
