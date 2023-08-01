class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  async paginate() {
    const isPaginated = this.queryString.isPaginated === true;

    let { page = 1, limit = 10 } = this.queryString;
    page = Number(page);
    limit = Number(limit);

    const countQuery = { ...this.query.getQuery() };

    const totalResults = await this.query.model.countDocuments(countQuery);

    const totalPages = isPaginated ? Math.ceil(totalResults / limit) : 1;

    this.query = isPaginated
      ? this.query.limit(limit).skip((page - 1) * limit)
      : this.query;

    const results = await this.query.exec();

    const start = (page - 1) * limit;
    const end = page * limit;
    const previousPage = isPaginated ? (start > 0 ? page - 1 : null) : null;
    const nextPage = isPaginated
      ? end < totalResults
        ? page + 1
        : null
      : null;
    const currentPage = isPaginated ? page : 1;

    const meta = {
      totalResults,
      totalPages,
      currentPage,
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
      queryObj.tags = { $in: queryObj.tags };
    }

    if (queryObj.tagName) {
      const tagNames = queryObj.tagName
        .split(',')
        .map((tag) => new RegExp(tag, 'i'));

      queryObj.name = { $in: tagNames };
    }

    if (queryObj.category) {
      queryObj.accountType = queryObj.category;
    }

    if (queryObj.searchTerm) {
      const searchTerm = queryObj.searchTerm.trim();

      if (searchTerm !== '') {
        const searchRegex = new RegExp(searchTerm, 'i');

        const nameQuery = {
          $or: [
            { firstName: { $regex: searchRegex } },
            { lastName: { $regex: searchRegex } },
          ],
        };

        this.query = this.query.find(nameQuery);
      }

      delete queryObj.searchTerm;
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
