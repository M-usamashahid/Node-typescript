/**
 * This is a request to get data or information from a database collection or combination of collections.
 *@function get
 *
 * @param {Object} model - mongoose initated schema model to bind with db collection.
 * @param {Object} query - A query that specifies the documents from which to retrieve.
 * @param {Boolean} isSingle - Is used to get a single or multiple records.
 * @param {String} selectParams - Is used to get specific fields of the model.
 * @param {String} populateParams - Is used for populating the data inside the reference key.
 * @param {String} selectPopulate - Is used for populating sub document the data inside the reference key.
 * @param {String} sortParams - Is used to get sorted data in accending or decending order.
 * @param {Number} limit - Is used to get specific (limited) number of records.
 * @param {Number} skip - Is used to skip specific number of records.
 * @param {Boolean} inActive - Is record is in active state records.
 * @param {Boolean} isLean - Apply Lean Option
 *
 * @string You can add multiple fields in a string with a single space.
 *
 * @returns If you pass {IsSingle} true then return {Object} otherwize return {ArrayOfObjects}
 */

export const dbGet = (
  model: any,
  query: any = {},
  isSingle: Boolean = false,
  selectParams: any = null,
  populateParams: any = null,
  selectPopulate: any = null,
  sortParams: any = null,
  limit: any = null,
  skip: any = null,
  inActive: any = null,
  isLean = false
) => {
  return new Promise((resolve, reject) => {

    if (inActive && inActive === 'all') {  /** Fetch all records */
      if (query["isDeleted"]) {
        delete query.isDeleted;
      }
    } else if (inActive) {                /** Fetch all deleted records */
      query["isDeleted"] = true;
    } else {                              /** Fetch all active records */
      query["isDeleted"] = false;
    }

    if (isSingle) {
      model
        .findOne(query)
        .select(selectParams || "")
        .populate(populateParams || "")
        .lean(isLean)
        .exec((error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
    } else {
      model
        .find(query)
        .select(selectParams || "")
        .populate(populateParams || "", selectPopulate || "")
        .sort(sortParams || "")
        .skip(skip)
        .limit(limit)
        .lean(isLean)
        .exec((error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
    }
  });
};


/**
 * This method is used to insert a new document in a collection..
 *@function count
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 *  @param {Object} query - A query that specifies the documents from which to retrieve.
 *
 * @returns {Object} returns count.
 */
export const dbCount = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    query["isDeleted"] = false;
    model.countDocuments(query).exec((error: any, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * This is used to find the distinct values for a specified field across a single collection and returns the results in an array.
 *@function distinct
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {String} field - The field for which to return distinct values.
 *
 * @returns returns the results in an array.
 */
export const dbDistinct = (model: any, field: any) => {
  return new Promise((resolve, reject) => {
    model.distinct(field, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * This method is used to insert a new document in a collection..
 *@function save
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {String} document - A document to save to the collection.
 *
 * @returns {Object} returns the newly created document with _id.
 */
export const dbSave = (model: any, document: any) => {
  return new Promise((resolve, reject) => {
    new model(document).save((error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * This method is used to insert a new document in a collection..
 *@function saveMany
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {String} document -A document or array of documents to insert into the collection.
 *
 */
export const dbSaveMany = (model: any, document: any) => {
  return new Promise((resolve, reject) => {
    model.insertMany(document, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * This method is used to modify an existing document or documents in a collection.
 * The method can modify specific fields of an existing document or documents or replace an existing document entirely,
 * depending on the update parameter. By default, the update() method updates a single document.
 * Set the Multi-Parameter to update all documents that match the query criteria.
 *@function update
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {Object} query - A query that specifies the documents from which to update.
 * @param {String} document -A document or array of documents to update into the collection.
 *
 */
export const dbUpdate = (
  model: any,
  query: any,
  update: any,
  options?: any
) => {
  return new Promise((resolve, reject) => {
    model.updateOne(query, update, options, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

export const dbUpdateMany = (
  model: any,
  query: any,
  update: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    model.updateMany(query, update, options, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * The method is used to remove documents from a collection.
 *@function remove
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {Object} query - Specifies deletion criteria using query operators.
 * To delete all documents in a collection, pass an empty document ({}).
 *
 */
export const dbRemove = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    model.remove(query, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

export const dbDeleteMany = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    model.deleteMany(query, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * The method is used to calculate aggregate values for the data in a collection.
 *@function aggregate
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {pipeline} query[] - A sequence of data aggregation operations or stages.
 * The method can still accept the pipeline stages as separate arguments instead of as elements in an array;
 * however, if you do not specify the pipeline as an array, you cannot specify the options parameter.
 *
 */
export const dbAggregate = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    model.aggregate(query, (error: any, doc: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};

/**
 * This method is used to insert/register a new document in a collection & convert the password in hash (sha256).
 *@function register
 *
 * @param model - Mongoose initated schema model to bind with db collection.
 * @param {String} document - A document to save to the collection.
 *
 * @returns {Object} returns the newly created document with _id.
 */
export const dbRegister = (model: any, document: any) => {
  return new Promise((resolve, reject) => {
    const obj = new model(document);
    if (document.password) {
      obj.password = obj.generateHash(document.password);
    }
    obj.save((error: any, doc: any) => {
      if (error) {
        console.log("Error", error);
        reject(error);
      } else {
        resolve(doc);
      }
    });
  });
};
