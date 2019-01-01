var app = angular.module('GodsEye')

app.controller('UserController', ['$scope', 'apiService', '$compile', '$http', function ($scope, apiService, $compile, $http) {
  const userId = $('#user_id').text().trim()

  apiService.getUserProfile()
    .then(function (res) {
      $scope.user = res.data.user
    })
    .catch(function (res) {
      // console.log(res)
    })

  apiService.getPersons()
    .then(function (res) {
      $scope.persons = res.data.persons
    })
    .catch(function (res) {
      console.log(res)
    })

  apiService.getPostsSameUserCreated(userId)
    .then(function (res) {
      $scope.posts = res.data.posts
    })
    .catch(function (res) {
      console.log(res)
    })

  // Get noti
  $scope.notifications = []
  let last = 0
  $scope.block = false

  function unique (a) {
    var seen = {}
    var out = []
    var len = a.length
    var j = 0
    for (var i = 0; i < len; i++) {
      var item = a[i]._id
      if (seen[item] !== 1) {
        seen[item] = 1
        out[j++] = a[i]
      }
    }
    return out
  }

  $scope.loadMoreNotification = async function () {
    if (userId) {
      $scope.block = true
      last = $scope.notifications.length - 1
      const newNotifications = (await apiService.getAllUserNotifications(userId, last + 1, 5)).data.notifications
      $scope.notifications = $scope.notifications.concat(newNotifications)
      $scope.notifications = unique($scope.notifications)
      $scope.block = false
      $scope.$apply()
    }
  }
  $scope.loadMoreNotification()
  $scope.goToEditPage = function (id) {
    window.location.replace('/post/edit/' + id)
  }

  $scope.delete = function (postId, $index) {
    var check = confirm('Delete post?')
    if (check === true) {
      $http({
        method: 'delete',
        url: '/api/post/' + postId
      }).then(function () {
        $scope.posts.splice($index, 1)
      })
    }
  }

  // Subscription
  $('#subscribedLocationsTable').DataTable({
    'ajax': {
      'url': '/api/user/subscribed',
      'dataSrc': 'subscribed'
    },
    'columns': [
      { 'data': 'address' },
      { 'data': 'name' },
      { 'data': null }
    ],
    createdRow: function (row, data, index) {
      $('td', row).eq(2).html('<button id="unsubscribeButton' + data._id + '" class="btn btn-warning" ng-click="unsubscribe(\'' + data._id + '\')">Unsubscribe</button>' +
        '<button id="subscribeButton' + data._id + '" class="btn btn-primary hide" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>')
      $compile(angular.element(row).contents())($scope)
    }
  })

  // all locations
  $('#allLocationsTable').DataTable({
    'ajax': {
      'url': '/api/location/',
      'dataSrc': 'locations'
    },
    'columns': [
      { 'data': 'address' },
      { 'data': 'name' },
      { 'data': null }
    ],
    createdRow: function (row, data, index) {
      if (data.subscribers.includes(userId)) {
        $('td', row).eq(2).html('<button id="unsubscribeButton' + data._id + '" class="btn btn-warning" ng-click="unsubscribe(\'' + data._id + '\')">Unsubscribe</button>' +
          '<button id="subscribeButton' + data._id + '" class="btn btn-primary hide" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>')
        $compile(angular.element(row).contents())($scope)
      } else {
        $('td', row).eq(2).html('<button id="unsubscribeButton' + data._id + '" class="btn btn-warning hide" ng-click="unsubscribe(\'' + data._id + '\')">Unsubscribe</button>' +
          '<button id="subscribeButton' + data._id + '" class="btn btn-primary" ng-click="subscribe(\'' + data._id + '\')">Subscribe</button>')
        $compile(angular.element(row).contents())($scope)
      }
      $compile(angular.element(row).contents())($scope)
    }
  })

  $scope.subscribe = function (locationId) {
    $http({
      method: 'GET',
      url: '/api/location/' + locationId + '/subscribe'
    }).then(function successCallback (response) {
      $('#subscribeButton' + locationId).addClass('hide')
      $('#unsubscribeButton' + locationId).removeClass('hide')
    }, function errorCallback (response) {
      console.log(response)
    })
  }

  $scope.unsubscribe = function (locationId) {
    $http({
      method: 'GET',
      url: '/api/location/' + locationId + '/unsubscribe'
    }).then(function successCallback (response) {
      $('#subscribeButton' + locationId).removeClass('hide')
      $('#unsubscribeButton' + locationId).addClass('hide')
    }, function errorCallback (response) {
      console.log(response)
    })
  }

  $scope.reloadTables = function () {
    $('#allLocationsTable').DataTable().ajax.reload()
    $('#subscribedLocationsTable').DataTable().ajax.reload()
  }

  $scope.verifyPhone = function () {
    if ($scope.user && !$scope.user.verified && $scope.user.phone) {
      smsLogin()
    }
  }
}])

AccountKit_OnInteractive = function () {
  AccountKit.init({
    appId: '895880713951104', // TODO: replace APP ID
    version: 'v1.1',
    fbAppEventsEnabled: true,
    state: $('#user_id').text().trim()
  })
}

function loginCallback (response) {
  if (response.status === 'PARTIALLY_AUTHENTICATED') {
    var code = response.code
    var csrf = response.state
    // Send code to server to exchange for access token

    $.ajax({
      url: '/api/user/verify-phone',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      success: function () {
        window.location.reload()
      },
      data: JSON.stringify({
        code: code,
        csrf: csrf
      }),
      error: function (data) {
        showErrorModal(data.responseJSON.message || 'Verify phone number failed')
      }
    })
  } else if (response.status === 'NOT_AUTHENTICATED') {
    // handle authentication failure
    showErrorModal('Verify phone number failed')
  } else if (response.status === 'BAD_PARAMS') {
    // handle bad parameters
    showErrorModal('Verify phone number failed')
  }
}

// phone form submission handler
function smsLogin () {
  var countryCode = document.getElementById('country_code').value
  var phoneNumber = document.getElementById('phone_number').value
  AccountKit.login(
    'PHONE',
    { countryCode: countryCode, phoneNumber: phoneNumber }, // will use default values if not specified
    loginCallback
  )
}
