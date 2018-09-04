var app = angular.module('GodsEye')
app.controller('sideBarController', ['$scope', 'apiService', function ($scope, apiService) {
    let locationId = $('#locationId').text().trim()
    apiService.getLocations()
        .then(function (res) {
            $scope.locations = res.data.locations
        })
        .catch(function (res) {
            console.log(res)
        })
    if ($(window).width() < 768) {
        $('#sidebar-container').removeClass('col-sm-3')
    }
    else {
        $('#sidebar-container').addClass('col-sm-3')
    }

    $scope.isActiveMobile = function (_id) {
        if (_id === locationId) {
            $('#' + _id).prependTo("#tabbar");
        }
        return _id === locationId
    }
    $scope.isActiveLaptop = function (_id) {
        return _id === locationId
    }
}])