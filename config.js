module.exports = {
  uriMongo: 'mongodb://localhost/GodsEye',
  google: {
    projectId: 'centering-dock-194606',
    cloudStorage: {
      bucketName: 'centering-dock-194606.appspot.com'
    }
  },
  microsoft: {
    cognitive: 'https://southeastasia.api.cognitive.microsoft.com',
    face: 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0',
    key1: '21eafac8fbba45c1915edb692bed7f59',
    key2: '57b4ea63c4b84b66899493eb2cc53ea2'
  },
  firebase: {
    apiKey: 'AIzaSyCPNxdhClY3HdBgH7e4WWw-DqDJiBXUD1Q',
    authDomain: 'centering-dock-194606.firebaseapp.com',
    databaseURL: 'https://centering-dock-194606.firebaseio.com',
    projectId: 'centering-dock-194606',
    storageBucket: 'centering-dock-194606.appspot.com',
    messagingSenderId: '813488161964'
  },
  address: 'http://20.184.8.69:3000',
  cookieOptions: { // Bo secure: true vi khong co HTTPS
    maxAge: 60 * 60 * 24 * 5 * 1000, // Set session expiration to 5 days.
    httpOnly: true
  }
}
