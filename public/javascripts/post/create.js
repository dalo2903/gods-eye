var app = angular.module('GodsEye')
let placeObj

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

  $('#create-post-form').on('submit', function (event) {
    event.preventDefault()
    $('#submit-create-post').attr('disabled', true)

    // serialize form to object
    var formData = $(this).serializeObject()
    formData['place'] = placeObj
    console.log(formData)

    apiService.createPost(formData)
      .then(function (res) {
        window.location.replace('/')
      })
      .catch(function (res) {
        // alert(res.data.message)
        showErrorModal(res.data.message)
        $('#submit-create-post').attr('disabled', false)
      })
  })

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

$.fn.serializeObject = function () {
  var o = {}
  var a = this.serializeArray()
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]]
      }
      o[this.name].push(this.value || '')
    } else {
      o[this.name] = this.value || ''
    }
  })
  return o
}

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
function initMap () {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 10.773942, lng: 106.660412 },
    zoom: 17
  })
  // var card = document.getElementById("pac-card");
  var input = document.getElementById('location')
  // var countries = document.getElementById("country-selector");

  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input)

  // Set initial restrict to the greater list of countries.
  autocomplete.setComponentRestrictions(
    { 'country': ['vn'] })

  // Specify only the data fields that are needed.
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name'])

  var infowindow = new google.maps.InfoWindow()
  var infowindowContent = document.getElementById('infowindow-content')
  infowindow.setContent(infowindowContent)
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  })

  autocomplete.addListener('place_changed', function () {
    $('#infowindow-content').removeClass('hide')
    infowindow.close()
    marker.setVisible(false)
    var place = autocomplete.getPlace()
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      // window.alert("No details available for input: '" + place.name + "'")
      return
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location)
      map.setZoom(17) // Why 17? Because it looks good.
    }

    marker.setPosition(place.geometry.location)
    marker.setVisible(true)

    var address = ''
    if (place.address_components) {
      address = [
        ((place.address_components[0] && place.address_components[0].short_name) || ''),
        ((place.address_components[1] && place.address_components[1].short_name) || ''),
        ((place.address_components[2] && place.address_components[2].short_name) || '')
      ].join(' ')
    }

    infowindowContent.children['place-icon'].src = place.icon
    infowindowContent.children['place-name'].textContent = place.name
    infowindowContent.children['place-address'].textContent = address

    placeObj = {
      name: place.name,
      address: address,
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
      }
    }

    infowindow.open(map, marker)
  })
}
