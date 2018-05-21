var app = angular.module('GodsEye')

app.controller('identifyController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.identify = function () {
    var formData = new FormData()
    formData.append('sampleFile', document.getElementById('image').files[0])
    apiService.identify(formData)
      .then(function (res) {
        console.log(res)
        $('#result').append('<table class="table"><thead><td>Name</td><td>Student ID</td><thead><tr><td>'+res.data[0].name +'</td><td>'+res.data[0].MSSV +'</td></tr></table>')
      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
