const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Person = mongoose.model('Person')
// const responseStatus = require('../../configs/responseStatus')

class PersonController extends BaseController {
  constructor () {
    super(Person)
  }

  async createPerson (obj, uuid) {
    // if (!obj.title) throw responseStatus.Response(400, {}, 'title')
    const person = {
      uuid: uuid,
      name: obj.title || 'name',
      mspersonid: '',
      status: 100,
      score: 100,
      datas: obj.datas
    }
    await this.create(person)
  }

  // async getPost (_id) {
  //   const post = await Post.findById(_id).populate({ path: 'author', select: 'name avatar uuid' })
  //     .populate({ path: 'datas', select: 'URL' }).exec()
  //   if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
  //   else return responseStatus.Response(200, { post: post })
  // }

  // async getPostPopulateAuthor (_id) {
  //   const post = await Post.findById(_id).populate({ path: 'author', select: 'name avatar uuid' }).exec()
  //   if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
  //   else return responseStatus.Response(200, { post: post })
  // }

  // async getPostsPopulateAuthor () {
  //   const posts = await Post.find().populate({ path: 'author', select: 'name avatar uuid' }).populate({ path: 'datas', select: 'URL' }).sort('-createdAt').exec()
  //   return responseStatus.Response(200, { posts: posts })
  // }
}

module.exports = new PersonController()
