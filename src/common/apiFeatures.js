class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  async paginate() {
    if (!this.queryString.isPaginated) {
      const data = await this.query.exec();

      return {
        data,
      };
    }

    let { page = 1, limit = 10 } = this.queryString;
    page = Number(page);
    limit = Number(limit);

    const countQuery = { ...this.query.getQuery() };

    const totalResults = await this.query.model.countDocuments(countQuery);

    const totalPages = Math.ceil(totalResults / limit);

    this.query = this.query.limit(limit).skip((page - 1) * limit);

    const results = await this.query.exec();

    const start = (page - 1) * limit;
    const end = page * limit;
    const previousPage = start > 0 ? page - 1 : null;
    const nextPage = end < totalResults ? page + 1 : null;

    const meta = {
      totalResults,
      totalPages,
      currentPage: page,
      previousPage,
      nextPage,
    };

    return {
      data: results,
      meta,
    };
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    if (queryObj.title) {
      queryObj.title = { $regex: queryObj.title, $options: 'i' };
    }

    if (queryObj.author) {
      queryObj.author = { $regex: queryObj.author, $options: 'i' };
    }

    if (queryObj.tags) {
      queryObj.tags = { $in: queryObj.tags.split(',') };
    }

    if (queryObj.category) {
      queryObj.accountType = queryObj.category;
    }

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }
}

module.exports = APIFeatures;
