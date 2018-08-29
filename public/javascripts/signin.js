var app = angular.module('GodsEye')

app.controller('SignInController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.signUp = function () {
    const json = {
      name: $('#signupForm input[name=name]').val().trim(),
      email: $('#signupForm input[name=email]').val().trim(),
      password: $('#signupForm input[name=password]').val().trim()
    }
    apiService.signUp(json)
      .then(function (res) {
        alert(res.data.message)
        window.location.href = '/'
      })
      .catch(function (res) {
        alert(res.data.message)
      })
  }
}])
