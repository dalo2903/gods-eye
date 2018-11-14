var app = angular.module('GodsEye')
app.controller('SubscriptionController', ['$scope', 'apiService', function ($scope, apiService) {
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
        fnCreatedRow: function (row, data, index) {
            if (data.subscribers.includes(userId)) {
                $('td', row).eq(2).html('<button id="unsubscribeButton" class="btn btn-warning" ng-click="unsubscribe(' + data._id + ')">Unsubscribe</button>');
            }
            else {
                $('td', row).eq(2).html('<button id="subscribeButton" class="btn btn-primary" ng-click="subscribe(' + data._id + ')">Subscribe</button>');
            }
        }
    });
    $scope.subscribe = function () {

    }
    $scope.unsubscribe = function () {

    }
}])