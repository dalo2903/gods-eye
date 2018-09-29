var app = angular.module('GodsEye')

app.controller('editController', ['$scope', 'apiService', function ($scope, apiService) {
    const _id = $('#_id').text().trim()
    apiService.getLocations()
        .then(function (res) {
            $scope.locations = res.data.locations
        })
        .catch(function (res) {
            console.log(res)
        })
    apiService.getPost(_id)
        .then(function (res) {
            $scope.post = res.data.post
        })
        .catch(function (res) {
            console.log(res)
        })
    //$('#location').val($scope.post.location)
}])


