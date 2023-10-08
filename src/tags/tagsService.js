const { apiFeatures } = require('../common');
const { Tag } = require('../../model');
const { TAG_DETAILS } = require('../../constant');

/**
 * Tags Service
 * @class TagsService
 */
class TagsService {
  /**
   * Checks if a tag with the specified name exists in the database.
   *
   * @private
   * @param {string} tagName - The name of the tag to check.
   * @returns {Promise<{ id: string, name: string }|null>} A Promise that resolves to the existing tag object or null if not found.
   */
  async _tagExists(tagName) {
    const tag = await Tag.findOne({ name: tagName.toLowerCase() });
    return tag ? tag : null;
  }

  /**
   * Retrieves a list of tag IDs from the database based on an array of tag names.
   *
   * @private
   * @param {string[]} tags - An array of tag names to find.
   * @returns {{ _id: string }[]|null} An array of tag IDs or null if no tags are found.
   */
  async _getTagId(tags) {
    const tagPromises = tags.map((tag) => this._tagExists(tag));
    const tagIdArr = (await Promise.all(tagPromises))
      .filter((tag) => tag !== null)
      .map(({ _id }) => _id.toString());

    return tagIdArr;
  }

  /**
   * Creates a new tag in the database if it doesn't already exist.
   *
   * @private
   * @param {string} tag - The name of the tag to create.
   * @param {string} createdBy - The id of the user creating the tag.
   * @returns {Promise<{ id: string, name: string }>} A Promise that resolves to the created or existing tag object.
   */
  async _createTag(tag, createdBy, session = null) {
    const tagExists = await this._tagExists(tag);
    if (tagExists) {
      return { _id: tagExists._id, name: tagExists.name };
    }

    const [newTag] = await Tag.create(
      [{ name: tag.toLowerCase(), createdBy }],
      {
        session,
      }
    );
    return { _id: newTag._id, name: newTag.name };
  }

  /**
   * Creates tags in the database based on an array of tag names.
   *
   * @param {string[]} tags - An array of tag names to create.
   * @param {string} createdBy - The id of the user creating the tags.
   * @returns {Promise<{ id: string, name: string }[]>} A Promise that resolves to an array of created or existing tag objects.
   */
  async createTags(tags, createdBy, session = null) {
    const tagPromises = tags.map((tag) =>
      this._createTag(tag, createdBy, session)
    );
    return await Promise.all(tagPromises);
  }

  /**
   * Retrieves a list of tags from the database based on the specified query options.
   *
   * @param {Object} req.query - The query options for filtering, sorting, and pagination.
   * @returns {Promise<{ id: string, name: string }[]>} A Promise that resolves to an array of tag objects matching the query.
   */
  async getTags({ query }) {
    const tagsQuery = Tag.find({}).select(Object.values(TAG_DETAILS));
    const tags = await new apiFeatures(tagsQuery, query)
      .filter()
      .sort()
      .paginate();
    return tags;
  }
}

module.exports = TagsService;
