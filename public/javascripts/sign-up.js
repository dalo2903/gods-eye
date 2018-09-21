var app = angular.module('GodsEye')
let placeObj

app.controller('SignUpController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.signUp = function () {
    const json = {
      name: $('#signupForm input[name=name]').val().trim(),
      email: $('#signupForm input[name=email]').val().trim(),
      password: $('#signupForm input[name=password]').val().trim(),
      place: placeObj
    }

    apiService.signUp(json)
      .then(function (res) {
        window.location.href = '/'
      })
      .catch(function (res) {
        alert(res.data.message)
      })
  }
}])

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
      window.alert("No details available for input: '" + place.name + "'")
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
