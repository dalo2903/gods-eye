const Storage = require('@google-cloud/storage')
const config = require('../../config')

const bucketName = config.google.cloudStorage.bucketName

const storage = new Storage({
  projectId: config.google.projectId,
  keyFilename: 'CC14-2fb6831eca13.json'
})

const bucket = storage.bucket(bucketName)

// async function uploadFile (file) {
// console.log(file)
// const url = await storage
//   .bucket(bucketName)
//   .upload(file.path, { destination: 'images/' + file.name })
// return url
// }

function uploadFile (req) {
  return new Promise((resolve, reject) => {
    if (!req.files) {
      throw reject(new Error('No file uploaded.')) // res.status(400).send('No file uploaded.')
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.files.file.name)

    // Make sure to set the contentType metadata for the browser to be able
    // to render the image instead of downloading the file (default behavior)
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.files.file.mimetype
      }
    })

    blobStream.on('error', err => {
      console.log(err)
      reject(err)
    })

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`
      // Make the image public to the web (since we'll be displaying it in browser)
      blob.makePublic().then(() => {
        // return publicUrl
        return resolve(publicUrl)
      })
    })

    blobStream.end(req.files.file.data)
  })
}

module.exports = {
  uploadFile: uploadFile
}
