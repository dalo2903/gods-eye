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
    addDataForPerson: function (formData) {
      var req = {
        method: 'POST',
        url: '/api/person/face/add',
        headers: {
          'Content-Type': undefined
        },
        data: formData
      }
      return $http(req)
    },
    getPostsSameUserCreated: function (userId) {
      return $http.get(`/api/user/${userId}/posts`)
    },
    getPostsByLocation: function (LocationId) {
      return $http.get(`/api/location/${LocationId}/posts`)
    },
    getPersons: function () {
      return $http.get('/api/person')
    },
    getPerson: function (_id) {
      return $http.get('/api/person/' + _id)
    },
    getLocations: function () {
      return $http.get('/api/location/')
    },
    getLocation: function (_id) {
      return $http.get(`/api/location/${_id}`)
    },
    getNotification: function (_id) {
      return $http.get(`/api/notification/${_id}`)
    },
    addFace: function (formData) {
      var req = {
        method: 'POST',
        url: '/api/person/add-face',
        headers: {
          'Content-Type': undefined
        },
        data: formData
      }
      return $http(req)
    },
    signUp: function (json) {
      return $http.post('/api/auth/sign-up', json)
    },
    signIn: function (json) {
      return $http.post('/api/auth/sign-in', json)
    },
    getUnseenUserNotifications: function (userId, skip, limit) {
      return $http.get(`/api/user/${userId}/unseenNotifications?skip=${skip}&limit=${limit}`)
    },
    getAllUserNotifications: function (userId, skip, limit) {
      return $http.get(`/api/user/${userId}/allNotifications?skip=${skip}&limit=${limit}`)
    },
    setSeenNotification: function (_id) {
      return $http.get(`/api/notification/setSeen/${_id}`)
    },
    getVisualDataForLabel: function (skip, limit) {
      return $http.get(`/api/visualdata/label?skip=${skip}&limit=${limit}`)
    },
    setLabelVisualData: function (json) {
      return $http.post('/api/visualdata/label', json)
    },
    getPosts: function (skip, limit) {
      return $http.get(`/api/post?skip=${skip}&limit=${limit}`)
    }
  }
}])
