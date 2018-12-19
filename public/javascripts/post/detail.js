var app = angular.module('GodsEye')

app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  $scope.report = function (postId) {
    var check = confirm('Report post for rules violation?')
    if (check == true) {
      $http({
        method: 'put',
        url: '/api/post/' + postId + '/report'
      }).then(function successCallback(response) {
        $('#reportButton' + postId).attr('disabled', 'disabled')
        $('#reportButton' + postId).removeClass('btn-danger')
        $('#reportButton' + postId).html('Reported')
      }, function errorCallback(response) {
        console.log(response)
      })
    }
  }
  apiService.getPost(_id)
    .then(function (res) {
      $scope.post = res.data.post
    })
    .catch(function () {
    })

}])
