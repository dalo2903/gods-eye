const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const responseStatus = require('../../configs/responseStatus')

class PostController extends BaseController {
  constructor () {
    super(Post)
  }

  async createPost (obj, userCreated) {
    // if (!obj.title) throw responseStatus.Response(400, {}, 'title')
    const _post = {
      userCreated: userCreated,
      tags: obj.tags || [],
      title: obj.title || 'title',
      type: obj.type,
      datas: obj.datas,
      location: obj.location
    }
    console.log(obj.datas)
    const post = await this.create(_post)
    return post
  }

  async getPost (_id) {
    const post = await Post.findById(_id)
      .populate({ path: 'userCreated', select: 'name avatar' })
      .populate({ path: 'location', select: 'name address' })
      .populate({
        path: 'datas',
        select: 'URL identifyResult',
        model: 'VisualData',
        populate: {
          path: 'identifyResult.persons.personId',
          model: 'Person',
          select: 'name'
        } }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostPopulateAuthor (_id) {
    const post = await Post.findById(_id).populate({ path: 'userCreated', select: 'name avatar' }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostsPopulateAuthor (skip, limit) {
    const posts = await Post.find().sort('-createdAt').skip(skip).limit(limit).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas location', select: 'URL address name isImage' }).exec()
    return responseStatus.Response(200, { posts: posts })
  }

  async getPostsSameUserCreated (userCreated) {
    const posts = await Post.find({ userCreated: userCreated }).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas', select: 'URL' })
    return responseStatus.Response(200, { posts: posts })
  }

  async getPostsByLocation (location) {
    const posts = await Post.find({ location: location }).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas location', select: 'URL address name' }).sort('-createdAt')
    return responseStatus.Response(200, { posts: posts })
  }
}

module.exports = new PostController()
