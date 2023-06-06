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
      .populate('author', {
        firstName: 1,
        lastName: 1,
      })
      .exec();
    return this;
  }
}

module.exports = APIFeatures;
