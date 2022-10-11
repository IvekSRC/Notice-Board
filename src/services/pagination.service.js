// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
/**
 * @param { mongoose.Model } Model
 */
const getPaginated = async (Model, req, res) => {
  try {
    let { skip = 0, limit = 10, sortProps, sortOrder, searchByTags } = req.query;
    const parentReference = req.parentReference;

    const sortable = Object.keys(Model.schema.tree);
    
    let isSortable;
    if(sortProps != undefined && sortOrder != undefined && sortProps.length == sortOrder.length) {
      isSortable = sortProps.every((sortBy) => sortable.includes(sortBy));
    }
    
    var query;
    if(searchByTags) {
      query = Model.find(
        {
          ...parentReference, 
          tags: { $all: searchByTags }
        }
      ).limit(limit).skip(skip);
    } else {
      query = Model.find(
        {
          ...parentReference, 
        }
      ).limit(limit).skip(skip);
    }

    const sortBy = {};
    if (isSortable == true) {
      sortProps.forEach((element, index) => {
        sortBy[element] = sortOrder[index];
      });
      query.sort(sortBy);
    } else if(isSortable == false) {
      throw new Error('Sorting by wanted criteria is not possible.');
    }

    const count = await Model.countDocuments(parentReference);
    const results = await query;

    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    return { results, totalPages, currentPage };
  } catch (error) {
    throw new Error('Pagination error - ' + error.message)
  }
};

module.exports = {
  getPaginated,
};