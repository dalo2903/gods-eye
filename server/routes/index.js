var express = require('express')
var router = express.Router()
// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage')
var path = require('path')

// Your Google Cloud Platform project ID
const projectId = 'centering-dock-194606'

// Creates a client
const storage = new Storage({
  projectId: projectId
})

// The name for the new bucket
const bucketName = 'centering-dock-194606.appspot.com'

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
  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    uploadFile(pathFile, sampleFile.name)
    res.send('File uploaded!')
  })
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
