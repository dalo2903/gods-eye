var app = angular.module('GodsEye')

app.controller('AdminController', ['$scope', 'apiService', function ($scope, apiService) {
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
}])
