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
    },
    createPost: function (formData) {
      var req = {
        method: 'POST',
        url: '/api/post',
        headers: {
          'Content-Type': undefined
        },
        data: formData
      }
      return $http(req)
    },
    getPost: function (_id) {
      return $http.get('/api/post/' + _id)
    },
    createPerson: function (formData) {
      var req = {
        method: 'POST',
        url: '/api/person',
        headers: {
          'Content-Type': undefined
        },
        data: formData
      }
      return $http(req)
    },
    getPersons: function () {
      return $http.get('/api/person')
    },
    getLocations: function (_id) {
      return $http.get('/api/location/')
    }
  }
}])
