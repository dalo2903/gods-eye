var app = angular.module('GodsEye')

app.controller('createController', ['$scope', 'apiService', function ($scope, apiService) {
  // $scope.post = {
  //   title: '',
  //   images: []
  // }
  // let files = []
  // function readURL (input) {
  //   if (input.files && input.files[0]) {
  //     var reader = new FileReader()
  //     reader.onload = function (e) {
  //       // $('#preview').attr('src', e.target.result)
  //       // console.log(e.target.result)
  //       $scope.post.images.push(e.target.result)
  //       // console.log($scope.post.images)
  //       $scope.$apply()
  //     }
  //     reader.readAsDataURL(input.files[0])
  //   }
  //   // get the files
  //   // var files = input.files
  //   for (var i = 0; i < input.files.length; i++) {
  //     files.push(input.files[i])
  //   }
  // }

  // $('#files').change(function () {
  //   readURL(this)
  // })

  $scope.createPost = function () {
    // let formData = new FormData()
    // formData.append('title', $scope.post.title)
    // formData.append('location', $('#location').val())
    // for (var x = 0; x < files.length; x++) {
    //   formData.append('files', files[x])
    // }
    // formData.append('file', files[0])
    // for (var value of formData.entries()) {
    //   console.log(value[0]+value[1]);
    // }
    // $('#submit-create-post').attr('disabled', true)
    // apiService.createPost(formData)
    //   .then(function (res) {
    //     console.log(res)
    //     window.location.replace('/')
    //     // alert('Post created successfully')
    //   })
    //   .catch(function (res) {
    //     alert(res.data.message)
    //     $('#submit-create-post').attr('disabled', false)
    //     console.log(res)
    //   })
  }

  apiService.getLocations()
    .then(function (res) {
      $scope.locations = res.data.locations
    })
    .catch(function (res) {
      console.log(res)
    })

 /*  $(document).ready(function () {
    $('#location').select2()
  }) */
}])

$(function () {
  $.fn.filepond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

  // Turn input element into a pond with configuration options
  $('.my-pond').filepond({
    allowMultiple: true
  })

  // Listen for addfile event
  $('.my-pond').on('FilePond:addfile', function (e) {
    // console.log('file added event', e)
  })
})
