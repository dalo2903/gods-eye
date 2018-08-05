class BaseController {
  constructor (Model) {
    this.Model = Model
  }

  async get (_id) {
    return this.Model.findById(_id.toString())
  }

  async getAll (offset, limit) {
    return this.Model.find().skip(offset).limit(limit)
  }

  async delete (_id) {
    return this.Model.findByIdAndRemove(_id.toString())
  }

  async create (obj) {
    return this.Model.create(obj)
  }
}

module.exports = BaseController
