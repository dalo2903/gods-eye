module.exports = {
  uriMongo: 'mongodb://god:godseye1@ds127362.mlab.com:27362/godseye',
  google: {
    projectId: 'august-ascent-216104', // 'centering-dock-194606',
    cloudStorage: {
      bucketName: 'demo-home-guard' // 'centering-dock-194606.appspot.com'
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
  address: 'https://god-eye-cc14.herokuapp.com/',
  cookieOptions: { // Bo secure: true vi khong co HTTPS
    maxAge: 60 * 60 * 24 * 5 * 1000, // Set session expiration to 5 days.
    httpOnly: true
  },
  token: {
    expiresIn: '365 days',
    secret: 'cuoituancuoituan'
  },
  datasetDir: 'dataset',
  deep: {
    domain: 'http://35.221.250.98',
    // domain: 'http://127.0.0.1:5000',
    secret: 'hK0Oeiy2zft0ZZtbmaawNW5zT0Ebcybn'
  }
}
