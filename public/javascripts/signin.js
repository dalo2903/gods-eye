var app = angular.module('GodsEye')

app.controller('SignInController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.signIn = function () {
    const json = {
      email: $('#signinForm input[name=email]').val().trim(),
      password: $('#signinForm input[name=password]').val().trim()
    }
    apiService.signIn(json)
      .then(function (res) {
        if (res.data.user.role > 900) {
          window.location.href = '/admin'
          return
        }
        window.location.href = '/'
      })
      .catch(function (res) {
        showErrorModal(res.data.message)
      })
  }
}])
