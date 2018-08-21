var app = angular.module('GodsEye')

app.controller('createController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.post = {
    title: '',
    images: []
  }

  let files = []

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader()
      reader.onload = function (e) {
        // $('#preview').attr('src', e.target.result)
        // console.log(e.target.result)
        $scope.post.images.push(e.target.result)
        // console.log($scope.post.images)
        $scope.$apply()
      }
      reader.readAsDataURL(input.files[0])
    }
    // get the files
    // var files = input.files
    for (var i = 0; i < input.files.length; i++) {
      files.push(input.files[i])
    }
  }

  $('#files').change(function () {
    readURL(this)
  })

  $scope.createPost = function () {
    let formData = new FormData()
    formData.append('title', $scope.post.title)
    formData.append('file', files[0])
    apiService.createPost(formData)
      .then(function (res) {
        console.log(res)
        window.location.replace("/newsfeed");
        alert('Post created successfully')
      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
