const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Relationship = mongoose.model('Relationship')
const responseStatus = require('../../configs/responseStatus')
const relationshipEnum = require('../../configs/constants').relationshipEnum

class RelationshipController extends BaseController {
  constructor () {
    super(Relationship)
  }

  async createRelationship (obj, postId) {
    let relationship = {
      personid: obj.personid,
      location: obj.location,
      type: obj.type
    }
    relationship = await this.create(relationship)
    return relationship
  }
  async getRelationship (personId, location) {
    const relationship = await Relationship.find({ personId: personId, location: location })
    return relationship
  }
  async updateRelationship (_id, type) {
    let relationship = await this.get(_id)
    relationship.type = relationshipEnum[type]
    await relationship.save()
  }
}

module.exports = new RelationshipController()
