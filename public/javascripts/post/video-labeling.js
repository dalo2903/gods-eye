var app = angular.module('GodsEye')

app.controller('VideoLabelingController', ['$scope', 'apiService', '$http', function ($scope, apiService, $http) {
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
  $scope.loadMore = async function () {
    $scope.block = true
    last = $scope.scrollData.length - 1
    const videos = (await apiService.getVisualDataForLabel(last + 1, 5)).data.visualDatas
    // for (var i = last + 1; i < last + 3; i++) {
    //   $scope.scrollData.push(posts[i])
    // }

    $scope.scrollData = $scope.scrollData.concat(videos)
    $scope.scrollData = unique($scope.scrollData)
    $scope.block = false
    $scope.$apply()
  }
  $scope.setLabel = async function (visualData, label) {
    const json = {
      visualData: visualData,
      label: label
    }
    apiService.setLabelVisualData(json).then(function (res) {
      $(visualData).hide()
    }).catch(function (res) {
      alert(res.data.message)
    })
  }
}

])
