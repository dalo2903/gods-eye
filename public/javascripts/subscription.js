var app = angular.module('GodsEye')
app.controller('SubscriptionController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
    let userId = $('#user_id').text().trim()
    // if ($(window).width() < 768) {
    //     $('#sidebar-container').removeClass('col-sm-3')
    // }
    // else {
    //     $('#sidebar-container').addClass('col-sm-3')
    // }
    $('#allLocationsTable').DataTable({
        "ajax": {
            "url": "/api/location/",
            "dataSrc": "locations"
        },
        "columns": [
            { "data": "address" },
            { "data": "name" },
            { "data": null }
        ],
        createdRow: function (row, data, index) {
            if (data.subscribers.includes(userId)) {
                $('td', row).eq(2).html('<button id="unsubscribeButton" class="btn btn-warning" ng-click="unsubscribe(' + data._id + ')">Unsubscribe</button>');
                $compile(angular.element(row).contents())($scope);
            }
            else {
                $('td', row).eq(2).html('<button id="subscribeButton" class="btn btn-primary" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>');
                $compile(angular.element(row).contents())($scope);

            }
        }
    });
    $scope.subscribe = function (locationId) {
        $http({
            method: 'GET',
            url: '/api/location/' + locationId + '/subscribe'
        }).then(function successCallback(response) {
            console.log("abc")
        }, function errorCallback(response) {
            console.log(response)
        });
    }
    $scope.unsubscribe = function (locationId) {
        console.log("12412")
    }
}])