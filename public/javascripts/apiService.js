angular.module('GodsEye').factory('apiService', ['$http', function ($http) {
  return {
    identify: function (formData) {
      var req = {
        method: 'POST',
        url: '/identify',
        headers: {
          'Content-Type': undefined
        },
        data: formData
      }
      return $http(req)
    },
    getImages: function () {
      return $http.get('/images')
    }
  }
}])
