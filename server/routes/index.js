var express = require('express')
var router = express.Router()
var fs = require("fs");

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage')
var path = require('path')
var request = require('sync-request');

// Your Google Cloud Platform project ID
const projectId = 'centering-dock-194606'

// Creates a client
const storage = new Storage({
  projectId: projectId
})

// The name for the new bucket
const bucketName = 'centering-dock-194606.appspot.com';
const personGroupId = 'test-faces';
const key1 = '21eafac8fbba45c1915edb692bed7f59';
const key2 = '57b4ea63c4b84b66899493eb2cc53ea2';
const khaPersonID = '67ad5f3f-131a-42da-b889-c7fda0c9da70'

const faceApiUrl = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0';
const personUrl = faceApiUrl + '/persongroups/' + personGroupId + '/persons';

//const imageApi = 'http://storage.googleapis.com/centering-dock-194606.appspot.com/images/';

function submitPerson (name){
  var res = request('POST',personUrl,{
    headers: {
      'Ocp-Apim-Subscription-Key': key1
    },
    json:{
      'name': name,
      'userData': name
    }
  });
}

function submitFace (personId, imageBinary){
  var url = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/' + personGroupId + '/persons/'+personId+'/persistedFaces';
  var res = request('POST', url, {
    headers: {
        'Ocp-Apim-Subscription-Key': key1,
        'Content-Type':'application/octet-stream'
    },
    body: imageBinary    
});
console.log('url: '+ url);

if (res.statusCode == 200) {
    console.log('SUCCESS - Submit image'+ faceUrl +'for person id'+ personId+'. Response: '+ res.body);
  }
else     
  console.log('FAIL '+ res.body);

}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/upload', function (req, res, next) {
  res.render('upload', { title: 'Express' })
})

router.post('/upload', function (req, res) {
  if (!req.files) { return res.status(400).send('No files were uploaded.') }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile
  // Use the mv() method to place the file somewhere on your server
  const pathFile = path.join(__dirname, '/../public/images/', sampleFile.name)
  var timestamp = Date.now();
  var newName = req.body.name + timestamp + path.extname(sampleFile.name);

  var buf = Buffer.from(sampleFile.data);
  submitFace(khaPersonID,buf);

  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    uploadFile(pathFile, newName);
    //
    var uploadedImage = imageApi + newName;
    console.log(uploadedImage);
    res.send('File uploaded! Name = ' + newName);

  })
});

router.post('/train', function (req, res) {
  const trainUrl = faceApiUrl + '/persongroups/'+personGroupId+'/train';
  var result = request('POST',personUrl,{
    headers: {
      'Ocp-Apim-Subscription-Key': key1,
      'Content-Type':'application/json'
    },
    data:"{}"
  });
  if (result.statusCode == 200) {
    console.log('SUCCESS - training data'+'. Response: '+ result.body);
  }
  else     
    console.log('FAIL '+ result.body);

})

function uploadFile (pathFile, fileName) {
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';
  // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

  // Uploads a local file to the bucket
  storage
    .bucket(bucketName)
    .upload(pathFile, { destination: 'images/' + fileName })
    .then(() => {
      console.log(`${fileName} uploaded to ${bucketName}.`)
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
  // [END storage_upload_file]
}

module.exports = router
