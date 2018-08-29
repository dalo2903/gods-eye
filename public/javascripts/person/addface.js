var app = angular.module('GodsEye')

app.controller('addFaceController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  apiService.getPerson(_id)
    .then(function (res) {
      $scope.person = res.data.person
      $scope.person.images = []
    })
    .catch(function (res) {
      console.log(res)
    })

  let files = []

  function readURL (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader()
      reader.onload = function (e) {
        // $('#preview').attr('src', e.target.result)
        // console.log(e.target.result)
        $scope.person.images.push(e.target.result)
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

  $scope.addFace = function () {
    let formData = new FormData()
    formData.append('_id', _id)
    formData.append('file', files[0])
    apiService.addFace(formData)
      .then(function (res) {
        console.log(res)
        alert('Add photo successfully')
        window.location.href = '/'
      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
