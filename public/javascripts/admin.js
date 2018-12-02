var app = angular.module('GodsEye')

app.controller('AdminController', ['$scope', 'apiService', '$http', '$compile', function ($scope, apiService, $http, $compile) {
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
  //All users
  $('#usersTable').DataTable({
    'ajax': {
      url: '/api/user/',
      dataSrc: 'users'
    },
    'columns': [
      { data: 'name' },
      {
        data: 'email',
      },
      { data: 'createdAt' },
      { data: 'reported' },
      {
        data: 'role',
        defaultContent: ''
      }
    ],
    fnCreatedRow: function (row, data, index) {
      if (data.role == 0) {
        $('td', row).eq(4).html('<button id="banButton' + data._id + '"class="btn btn-danger" ng-click="banUser(\'' + data._id + '\')">Ban user</button>' +
          '<button id="unbanButton' + data._id + '"class="btn btn-primary hide" ng-click="unbanUser(\'' + data._id + '\')">Unban user</button>')
      }
      else if (data.role == -1) {
        $('td', row).eq(4).html('<button id="banButton' + data._id + '"class="btn btn-danger hide" ng-click="banUser(\'' + data._id + '\')">Ban user</button>' +
          '<button id="unbanButton' + data._id + '"class="btn btn-primary" ng-click="unbanUser(\'' + data._id + '\')">Unban user</button>')
      } else if (data.role == 999) {
        $('td', row).eq(4).html('<button class="btn btn-danger" disabled ng-click="banUser(\'' + data._id + '\')">Ban user</button>')
      }
      $compile(angular.element(row).contents())($scope);
    },
    columnDefs: [
      {
        targets: 2,
        render: function (data) {
          return moment(data).format('HH:mm <br> DD/MM/YYYY')
        }
      }
    ]
  })
  $scope.banUser = function (userId) {
    $http({
      method: 'GET',
      url: '/api/user/' + userId + '/ban'
    }).then(function successCallback(response) {
      $('#banButton' + userId).addClass('hide')
      $('#unbanButton' + userId).removeClass('hide')
    }, function errorCallback(response) {
      console.log(response)
    });
  }
  $scope.unbanUser = function (userId) {
    $http({
      method: 'GET',
      url: '/api/user/' + userId + '/unban'
    }).then(function successCallback(response) {
      $('#banButton' + userId).removeClass('hide')
      $('#unbanButton' + userId).addClass('hide')
    }, function errorCallback(response) {
      console.log(response)
    });
  }

  // Reported posts
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
  $scope.loadMoreReportedPosts = async function () {
    last = $scope.scrollData.length - 1
    const newPosts = (await apiService.getReportedPosts(last + 1, 5)).data.posts
    $scope.scrollData = $scope.scrollData.concat(newPosts)
    $scope.scrollData = unique($scope.scrollData)
    $scope.$apply()
  }
  $scope.loadMoreReportedPosts()
  // $scope.approve = function (postId, $index) {
  //   $http({
  //     method: 'put',
  //     url: 'api/post/' + postId + '/approved'
  //   }).then(function () {
  //     $scope.scrollData.splice($index, 1)
  //   })
  // }
  $scope.delete = function (postId, $index) {
    var check = confirm("Delete post?");
    if (check == true) {
      $http({
        method: 'delete',
        url: 'api/post/' + postId
      }).then(function () {
        $scope.scrollData.splice($index, 1)
      })
    }

  }
  // //Pending labeled videos
  // $scope.videos = []
  // $scope.loadMoreVideos = async function () {
  //   last = $scope.videos.length - 1
  //   const newvideos = (await apiService.getVisualDataForApproving(last + 1, 5)).data.visualDatas
  //   $scope.videos = $scope.videos.concat(newvideos)
  //   $scope.videos = unique($scope.videos)
  //   $scope.$apply()
  // }
  // $scope.loadMoreVideos()
  // $scope.suspicious = function (videoId, $index) {

  // }
  // $scope.notSuspicious = function (videoId, $index) {

  // }
}])
