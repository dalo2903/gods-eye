var app = angular.module('GodsEye')

app.controller('AdminController', ['$scope', 'apiService', function ($scope, apiService) {
  // Location
  apiService.getLocations()
    .then(function (res) {
      $scope.locations = res.data.locations
    })
    .catch(function (res) {
      console.log(res)
    })
  // Visual data
  $('#visualTable').DataTable({
    "ajax": '/api/visual-data',
    "columns": [
      { "data": "URL" },
      { "data": "location.name" },
      { "data": "createdAt" },
      { "data": "identifyResult.persons[<br>].personId.name" }
    ],
    fnCreatedRow: function (row, data, index) {
      $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <img src="' + data.URL + '"></a>');
    }
  });
}])
