var app = angular.module('GodsEye')

app.controller('SignUpController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.signUp = function () {
    const json = {
      name: $('#signupForm input[name=name]').val().trim(),
      email: $('#signupForm input[name=email]').val().trim(),
      password: $('#signupForm input[name=password]').val().trim()
    }

    apiService.signUp(json)
      .then(function (res) {
        window.location.href = '/'
      })
      .catch(function (res) {
        showErrorModal(res.data.message)
      })
  }
}])
