var app = angular.module('GodsEye')
var postId

app.controller('NewsFeedController', ['$scope', 'apiService', '$http', '$window', function ($scope, apiService, $http, $window) {
  apiService.getUserProfile()
    .then(function (res) {
      $scope.user = res.data.user
    })
    .catch(function (res) {
      // console.log(res)
    })

  $scope.scrollData = []
  $scope.userId = $('#user_id').text().trim()
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

  $scope.loadMore = async function () {
    $scope.block = true
    last = $scope.scrollData.length - 1
    const newPosts = (await apiService.getPosts(last + 1, 5)).data.posts
    $scope.scrollData = $scope.scrollData.concat(newPosts)
    $scope.scrollData = unique($scope.scrollData)
    $scope.block = false
    $scope.$apply()
  }

  $scope.postDetail = function (id) {
    $window.location.href = '/post/' + id
  }

  // $scope.report = function (postId) {
  //   var check = confirm('Report post for rules violation?')
  //   if (check == true) {
  //     $http({
  //       method: 'put',
  //       url: '/api/post/' + postId + '/report'
  //     }).then(function successCallback (response) {
  //       $('#reportButton' + postId).attr('disabled', 'disabled')
  //       $('#reportButton' + postId).removeClass('btn-danger')
  //       $('#reportButton' + postId).html('Reported')
  //     }, function errorCallback (response) {
  //       console.log(response)
  //     })
  //   }
  // }

  $scope.showReportModal = function (post, _postId) {
    postId = _postId
    if (post.reported.includes($scope.userId)) {
      const reportedWithReason = post.reportedWithReason.filter(function (element) {
        return element && element.userId === $scope.userId
      })
      if (reportedWithReason && reportedWithReason.length) {
        $('#report-modal #reason').val(reportedWithReason[0].reason)
      } else $('#report-modal #reason').val('')
    } else $('#report-modal #reason').val('')
    $('#report-modal').modal('show')
    $('#report-modal').on('shown.bs.modal', function () {
      $('#report-modal #reason').focus()
    })
  }

  $scope.isReported = function (reported, postId) {
    if (reported.includes($scope.userId)) {
      // $('#reportButton' + postId).attr('disabled', 'disabled')
      $('#reportButton' + postId).removeClass('btn-danger')
      $('#reportButton' + postId).html('Reported')
      return false
    }
  }

  $scope.report = function () {
    if (!$('#report-modal #reason').val().trim()) {
      return showErrorModal('Please specify the reason')
    }
    $.ajax({
      url: '/api/post/' + postId + '/report',
      type: 'put',
      contentType: 'application/json',
      success: function () {
        showErrorModal('Thank you for reporting')
        $('#reportButton' + postId).html('Reported')
        $('#reportButton' + postId).removeClass('btn-danger')
        const scrollDataId = $scope.scrollData.map(function (e) {
          return e._id
        })
        $scope.scrollData[scrollDataId.indexOf(postId)].reported = $scope.scrollData[scrollDataId.indexOf(postId)].reported.filter(e => e.toString() !== $scope.userId.toString())
        $scope.scrollData[scrollDataId.indexOf(postId)].reportedWithReason = $scope.scrollData[scrollDataId.indexOf(postId)].reportedWithReason.filter(e => e.userId.toString() !== $scope.userId.toString())
        $scope.scrollData[scrollDataId.indexOf(postId)].reported.push($scope.userId)
        $scope.scrollData[scrollDataId.indexOf(postId)].reportedWithReason.push({
          userId: $scope.userId,
          reason: $('#report-modal #reason').val().trim()
        })
      },
      data: JSON.stringify({
        reason: $('#report-modal #reason').val().trim()
      }),
      error: function (data) {
        console.log(data)
        showErrorModal('Report failed. Please try again later.')
      }
    })
  }

  $scope.UserLogged = function () {

  }
}])

// function report () {
//   if (!$('#report-modal #reason').val().trim()) {
//     return showErrorModal('Please specify the reason')
//   }
//   $.ajax({
//     url: '/api/post/' + postId + '/report',
//     type: 'put',
//     contentType: 'application/json',
//     success: function () {
//       showErrorModal('Thank you for reporting')
//       $('#reportButton' + postId).html('Reported')
//       $('#reportButton' + postId).removeClass('btn-danger')
//     },
//     data: JSON.stringify({
//       reason: $('#report-modal #reason').val().trim()
//     }),
//     error: function (data) {
//       console.log(data)
//       showErrorModal('Report failed. Please try again later.')
//     }
//   })
// }
