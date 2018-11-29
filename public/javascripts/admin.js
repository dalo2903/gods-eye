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
  function unique(a) {
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
    last = $scope.scrollData.length - 1
    const newPosts = (await apiService.getPendingPosts(last + 1, 5)).data.posts
    $scope.scrollData = $scope.scrollData.concat(newPosts)
    $scope.scrollData = unique($scope.scrollData)
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
  }
  $scope.decline = function (postId, $index) {
    $http({
      method: 'delete',
      url: 'api/post/' + postId
    }).then(function () {
      $scope.scrollData.splice($index, 1)
    })
  }
  //Pending labeled videos
  $scope.videos = []
  $scope.loadMoreVideos = async function () {
    last = $scope.videos.length - 1
    const newvideos = (await apiService.getVisualDataForApproving(last + 1, 5)).data.visualDatas
    $scope.videos = $scope.videos.concat(newvideos)
    $scope.videos = unique($scope.videos)
    $scope.$apply()
  }
  $scope.loadMoreVideos()
  $scope.suspicious = function (videoId, $index) {

  }
  $scope.notSuspicious = function (videoId, $index) {

  }
}])
