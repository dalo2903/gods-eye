var app = angular.module('GodsEye')
app.controller('sideBarController', ['$scope', 'apiService', function ($scope, apiService) {
    apiService.getLocations()
        .then(function (res) {
            $scope.locations = res.data.locations
        })
        .catch(function (res) {
            console.log(res)
        })
    if ($(window).width() < 1024) {
        $('#sidebar-container').removeClass('col-lg-3')
    }
    else {
        $('#sidebar-container').addClass('col-lg-3')
    }
}])