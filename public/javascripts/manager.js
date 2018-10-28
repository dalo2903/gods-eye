var app = angular.module('GodsEye')

app.controller('managerController', ['$scope', 'apiService', function ($scope, apiService) {
    $('#visualTable').DataTable({
        "ajax": '/api/visual-data',
        "columns": [
            { "data": "URL" },
            { "data": "location.name" },
            { "data": "createdAt" },
            { "data": "identifyResult.persons[<br>- ].personId.name" }
        ],
        fnCreatedRow: function (row, data, index) {
            $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <img src="' + data.URL + '"></a>');
        }
    });

}])
