var app = angular.module('GodsEye')
app.controller('SubscriptionController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
    let userId = $('#user_id').text().trim()
    // if ($(window).width() < 768) {
    //     $('#sidebar-container').removeClass('col-sm-3')
    // }
    // else {
    //     $('#sidebar-container').addClass('col-sm-3')
    // }
    $('#subscribedLocationsTable').DataTable({
        "ajax": {
            "url": "/api/user/subscribed",
            "dataSrc": "subscribed"
        },
        "columns": [
            { "data": "address" },
            { "data": "name" },
            { "data": null }
        ],
        createdRow: function (row, data, index) {
            $('td', row).eq(2).html('<button id="unsubscribeButton' + data._id + '" class="btn btn-warning" ng-click="unsubscribe(\'' + data._id + '\')">Unsubscribe</button>' +
                '<button id="subscribeButton' + data._id + '" class="btn btn-primary hide" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>');
            $compile(angular.element(row).contents())($scope);
        }
    });
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
                $('td', row).eq(2).html('<button id="unsubscribeButton' + data._id + '" class="btn btn-warning" ng-click="unsubscribe(\'' + data._id + '\')">Unsubscribe</button>');
                $compile(angular.element(row).contents())($scope);
            }
            else {
                $('td', row).eq(2).html('<button id="subscribeButton' + data._id + '" class="btn btn-primary" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>');
                $compile(angular.element(row).contents())($scope);
            }
        }
    });
    $scope.subscribe = function (locationId) {
        $http({
            method: 'GET',
            url: '/api/location/' + locationId + '/subscribe'
        }).then(function successCallback(response) {
            alert("Subscribed")
            $('#allLocationsTable').DataTable().ajax.reload()
            $('#subscribedLocationsTable').DataTable().ajax.reload()
        }, function errorCallback(response) {
            console.log(response)
        });
    }
    $scope.unsubscribe = function (locationId) {
        $http({
            method: 'GET',
            url: '/api/location/' + locationId + '/unsubscribe'
        }).then(function successCallback(response) {
            alert("Unsubscribed")
            $('#allLocationsTable').DataTable().ajax.reload()
            $('#subscribedLocationsTable').DataTable().ajax.reload()
        }, function errorCallback(response) {
            console.log(response)
        });
    }
}])