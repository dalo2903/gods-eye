var app = angular.module('GodsEye')

app.controller('AdminController', ['$scope', 'apiService', '$http', function ($scope, apiService, $http) {
  // Location
  apiService.getLocations()
    .then(function (res) {
      $scope.locations = res.data.locations
    })
    .catch(function (res) {
      console.log(res)
    })
  // Visual data
  $('#visualTable').DataTable({
    'ajax': '/api/visual-data',
    'columns': [
      { data: 'URL' },
      {
        data: 'location.name',
        defaultContent: '<i>Not available</i>'
      },
      { data: 'createdAt' },
      { data: 'identifyResult.persons[<br>].personId.name' }
    ],
    fnCreatedRow: function (row, data, index) {
      if (data.isImage) {
        $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <img class="visual-data" src="' + data.URL + '"></a>')
      } else {
        $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <video class="visual-data" controls><source src="' + data.URL + '" type="video/mp4" ></video></a>')
      }
    },
    columnDefs: [
      {
        targets: 2,
        render: function (data) {
          return moment(data).format('HH:mm DD/MM/YYYY')
        }
      }
    ]
  })
  // Record
  $('#recordTable').DataTable({
    'ajax': '/api/record',
    'columns': [
      {
        data: 'URL',
        defaultContent: '<img class="visual-data" src="https://vignette.wikia.nocookie.net/mixels/images/f/f4/No-image-found.jpg"></a>'
      },
      {
        data: 'location.name',
        defaultContent: '<i>Not available</i>'
      },
      { data: 'createdAt' },
      {
        data: 'identifyResult.persons[<br>].personId.name',
        defaultContent: '<i>Not available</i>'
      }
    ],
    fnCreatedRow: function (row, data, index) {
      if (data.isImage) {
        $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <img class="visual-data" src="' + data.URL + '"></a>')
      } else {
        $('td', row).eq(0).html('<a style="color:blue" href="' + data.URL + '"> <video class="visual-data" controls><source src="' + data.URL + '" type="video/mp4" ></video></a>')
      }
    },
    columnDefs: [
      {
        targets: 2,
        render: function (data) {
          return moment(data).format('HH:mm DD/MM/YYYY')
        }
      }
    ]
  })
  // Pending posts
  $scope.scrollData = []
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
  $scope.loadMorePendingPosts = async function () {
    $scope.block = true
    last = $scope.scrollData.length - 1
    const newPosts = (await apiService.getPendingPosts(last + 1, 5)).data.posts
    // for (var i = last + 1; i < last + 3; i++) {
    //   $scope.scrollData.push(posts[i])
    // }
    $scope.scrollData = $scope.scrollData.concat(newPosts)
    $scope.scrollData = unique($scope.scrollData)
    $scope.block = false
    $scope.$apply()
  }
  $scope.loadMorePendingPosts()
  $scope.approve = function (postId, $index) {
    $http({
      method: 'put',
      url: 'api/post/' + postId + '/approved'
    }).then(function () {
      $scope.scrollData.splice($index, 1)
    })
    // $('#approve' + postId).html('Approved')
    // $('#decline' + postId).removeClass('btn-warning')
    // $('#approve' + postId).attr('disabled', 'disabled')
    // $('#decline' + postId).attr('disabled', 'disabled')
  }
  $scope.decline = function (postId, $index) {
    $http({
      method: 'delete',
      url: 'api/post/' + postId
    }).then(function () {
      $scope.scrollData.splice($index, 1)
    })
    // $('#decline' + postId).html('Declined')
    // $('#approve' + postId).removeClass('btn-primary')
    // $('#approve' + postId).attr('disabled', 'disabled')
    // $('#decline' + postId).attr('disabled', 'disabled')
  }
}])
