var app = angular.module('GodsEye')

app.controller('personController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.person = {
    name: '',
    personId: '',
    images: []
  }
  $scope.modalData = {
    personId: ''
  }
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

  $scope.createPerson = function () {
    // Check before create

    // Create
    let formData = new FormData()
    formData.append('name', $scope.person.name)
    formData.append('file', files[0])
    $('#submit-create-person').attr('disabled', true)

    apiService.createPerson(formData)
      .then(function (res) {
        console.log(res)
        if (res.status === 201) {
          $('#existed-modal').modal({ backdrop: true })
          $('#submit-create-person').attr('disabled', false)
          $scope.persons = res.data
        }
      })
      .catch(function (res) {
        $('#submit-create-person').attr('disabled', false)
        alert(res.data.message)
        console.log(res)
      })
  }

  $scope.addFaceForPerson = function () {
    let formData = new FormData()
    formData.append('_id', $scope.modalData.personId)
    formData.append('file', files[0])
    apiService.addDataForPerson(formData)
      .then(function (res) {
        console.log(res)
        alert(res.data.message)
        window.location.href = '/'
      }).catch(function (res) {
        alert(res.data.message)
        console.log(res)
      })
  }
}])
