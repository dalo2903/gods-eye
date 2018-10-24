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
        //window.location.href = '/'
      })
      .catch(function (res) {
        alert(res.data.message)
      })
  }

  $scope.signIn = function () {
    const json = {
      email: $('#signinForm input[name=email]').val().trim(),
      password: $('#signinForm input[name=password]').val().trim()
    }
    console.log(json)
    apiService.signIn(json)
      .then(function (res) {
        if (res.data.user.role > 900) {
          window.location.href = '/admin'
          return
        }
        window.location.href = '/'
      })
      .catch(function (res) {
        alert(res.data.message)
      })
  }
}])
