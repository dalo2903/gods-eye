const VisualDataController = require('./VisualDataController')
const download = require('download')
const fs = require('fs')
const config = require('../../config')

class DatasetCollector {
  async downloadDataset () {
    let videos = await VisualDataController.getAllVideoWithLabel(2)
    for (let video of videos) {
      let label = await this.getLabel(video)
      let dir = config.datasetDir + '/' + label
      console.log(`Downloading video URL: ${video.URL}...`)
      download(video.URL, dir).then(() => {
        console.log('Done!')
      })
    }
    return videos
  }

  async getLabel (video) {
    let videoLabels = video.labels.map(x => x.label)
    // console.log(videoLabels)
    var counts = {}

    for (var i = 0; i < videoLabels.length; i++) {
      let num = videoLabels[i]
      counts[num] = counts[num] ? counts[num] + 1 : 1
    }
    let label
    for (let num in counts) {
      label = counts[label] ? label : num
      label = counts[label] < counts[num] ? num : label
    }
    // console.log(counts)
    // console.log(label)
    return label
  }
}
module.exports = new DatasetCollector()
