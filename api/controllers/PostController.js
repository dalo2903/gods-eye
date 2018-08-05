const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const responseStatus = require('../../configs/responseStatus')

class PostController extends BaseController {
  constructor () {
    super(Post)
  }

  async createPost (obj, uuid) {
    // if (!obj.title) throw responseStatus.Response(400, {}, 'title')
    const post = {
      uuid: uuid,
      tags: obj.tags || [],
      title: obj.title || 'title',
      type: obj.type,
      datas: obj.datas
    }
    await this.create(post)
  }

  async getPost (_id) {
    const post = await Post.findById(_id).populate({ path: 'author', select: 'name avatar uuid' })
      .populate({ path: 'datas', select: 'URL' }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostPopulateAuthor (_id) {
    const post = await Post.findById(_id).populate({ path: 'author', select: 'name avatar uuid' }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostsPopulateAuthor () {
    const posts = await Post.find().populate({ path: 'author', select: 'name avatar uuid' }).exec()
    return responseStatus.Response(200, { posts: posts })
  }
}

module.exports = new PostController()
