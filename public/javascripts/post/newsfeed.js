var app = angular.module('GodsEye')

app.controller('NewsFeedController', ['$scope', 'apiService', '$http', function ($scope, apiService, $http) {
    $http({
        method: 'GET',
        url: '/api/post'
    }).then(function success(response) {
        response.data.posts.forEach(element => {
            $('#postContainer').append('<div><h1>' + element.title + '</h1></div><div id="' + element._id + '" class="data"></div><div class="fb-comments" data-href="http://godseye.ml/' + element._id + '" data-width="100%" data-numposts="2"></div><div class="line"><div>')
            element.datas.forEach(data => {
                $('#' + element._id).append('<img src=' + data.URL + '>')
            })
        });
    }, function error(response) {
        console.log(response)
    });
}])
