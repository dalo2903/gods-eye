var app = angular.module('GodsEye')

app.controller('UserController', ['$scope', 'apiService', function ($scope, apiService) {
    const userId = $('#user_id').text().trim()
    apiService.getPersons()
        .then(function (res) {
            $scope.persons = res.data.persons
        })
        .catch(function (res) {
            console.log(res)
        })

    apiService.getPostsSameUserCreated(userId)
        .then(function (res) {
            $scope.posts = res.data.posts
        })
        .catch(function (res) {
            console.log(res)
        })
}])
