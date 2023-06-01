class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const { page = 1, limit = 10 } = this.queryString;
    this.query = this.query
      .populate('author', {
        firstName: 1,
        lastName: 1,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    return this;
  }
}

module.exports = APIFeatures;
