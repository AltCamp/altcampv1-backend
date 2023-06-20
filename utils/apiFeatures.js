const { AUTHOR_DETAILS } = require('../constant');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginate() {
    const { page = 1, limit = 10 } = this.queryString;
    this.query = this.query
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'author',
        select: Object.values(AUTHOR_DETAILS),
      })
      .exec();
    return this;
  }
}

module.exports = APIFeatures;
