var app = angular.module('GodsEye')

app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  apiService.getNotification(_id)
    .then(function (res) {
      console.log(res)
      $scope.notification = res.data.notification
    })
    .catch(function (res) {
      console.log(res)
    })
}])

// function drawRectangle () {
//   // var c = document.getElementById('myCanvas')
//   // var ctx = c.getContext('2d')

//   // // var offset = $('img').offset()
//   // // Red rectangle
//   // ctx.beginPath()
//   // ctx.lineWidth = '6'
//   // ctx.strokeStyle = 'red'
//   // ctx.rect(5, 5, 201, 201)
//   // ctx.stroke()

//   var stage = new Facade(document.querySelector('#myCanvas'))
//   var rect = new Facade.Rect({
//     x: 0,
//     y: 0,
//     width: 201,
//     height: 201,
//     lineWidth: 6,
//     strokeStyle: '#333E4B',
//     fillStyle: '#1C73A8',
//     anchor: 'top/left'
//   })

//   stage.addToStage(rect)
// }
