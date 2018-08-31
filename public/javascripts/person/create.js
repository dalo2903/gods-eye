var app = angular.module('GodsEye')

app.controller('personController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.person = {
    name: '',
    images: []
  }

  let files = []

  function readURL(input) {
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

  $scope.createPerson = function () {
    let formData = new FormData()
    formData.append('name', $scope.person.name)
    formData.append('file', files[0])
    $("#submit-create-person").attr("disabled", true);

    apiService.createPerson(formData)
      .then(function (res) {
        console.log(res)
        alert('Person created successfully')
        window.location.href = '/'
      })
      .catch(function (res) {
        $("#submit-create-person").attr("disabled", false);
        alert(res.data.message)
        console.log(res)
      })
  }
}])
