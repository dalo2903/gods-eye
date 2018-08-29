var app = angular.module('GodsEye')

app.controller('addFaceController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  console.log(_id)
  
  apiService.getPerson(_id)
    .then(function (res) {
      $scope.person = res.data.person
    })
    .catch(function (res) {
      console.log(res)
    })
}])
