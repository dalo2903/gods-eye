const BaseController = require('./BaseController')
const UploadController = require('./UploadController')
const VisualDataController = require('./VisualDataController')
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
        select: 'URL isImage identifyResult',
        model: 'VisualData',
        populate: {
          path: 'identifyResult.persons.personId',
          model: 'Person',
          select: 'name'
        }
      }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostPopulateAuthor (_id) {
    const post = await Post.findById(_id).populate({ path: 'userCreated', select: 'name avatar' }).exec()
    if (!post) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { post: post })
  }

  async getPostsPopulateAuthor (skip, limit) {
    const posts = await Post.find({
      // status: 1
    }).sort('-createdAt').skip(skip).limit(limit).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas location', select: 'URL address name isImage' }).exec()
    return responseStatus.Response(200, { posts: posts })
  }

  async getReportedPosts (skip, limit) {
    const posts = await Post.find({
      $where: 'this.reported.length > 0'
    }).sort('-createdAt').skip(skip).limit(limit).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas location', select: 'URL address name isImage' }).exec()
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

  async setApproved (_id) {
    const post = await this.get(_id)
    await post.set({ status: 1 }).save()
  }

  // async reportPost (_id) {
  //   const post = await this.get(_id)
  //   post.reported += 1
  //   post.save()
  // }

  async reportPost (_id, userId) {
    const post = await Post.findById(_id).where('reported').ne(userId)
    if (!post) throw responseStatus.Response(404)
    post.reported.push(userId)
    await post.save()
    return responseStatus.Response(200)
  }

  async deletePost (_id) {
    const post = await Post.findByIdAndDelete(_id.toString()).populate({ path: 'datas', select: 'URL' }).exec()
    post.datas.map(e => {
      const fileName = e.URL.split('/').pop()
      UploadController.deleteFile(fileName)
      VisualDataController.delete(e._id)
    })
  }
}

module.exports = new PostController()
