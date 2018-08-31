var app = angular.module('GodsEye')

app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
  const _id = $('#_id').text().trim()
  apiService.getPost(_id)
    .then(function (res) {
      $scope.post = res.data.post

      // $scope.post.datas.forEach(function (data, index) {
      //   if (data.identifyResult && data.identifyResult.persons.length) {
      //     const facerectangle = data.identifyResult.persons[0].facerectangle
      //     $('#box-' + index).css({
      //       top: facerectangle.top + 'px',
      //       left: facerectangle.left + 'px'
      //     })
      //   }
      // })
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
