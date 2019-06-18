"use strict";

const fs = require('fs').promises;

const {MongoClient, ObjectId} = require('mongodb');

const PRODUCTS_FILE_DATA = './products.json';
const PRODUCTS_COLLECTION = 'products';

const CATEGORIES_FILE_DATA = './categories.json';
const CATEGORIES_COLLECTION = 'categories';
const USAGE = `
Usage:
 
 node load-to-mongodb.js mongodb://localhost database
`;


const [, , url, database] = process.argv;

if (!url || !database) {
  console.log(USAGE);
  process.exit(1);
}

/**
 * @param {object} categories {[title]: [...titles]}
 */
const transformCategories = categories => {
  return Object.entries(categories).map(([category, subcategories]) => {
    return {
      _id: ObjectId(),
      category,
      subcategories: subcategories.map((category) => {
        return {
          category,
          _id: ObjectId(),
        }
      })
    }
  });
};

const toJson = string => JSON.parse(string);

/**
 *
 * @param {[{category:string, _id:ObjectID, subcategories:[{category:string, _id:ObjectId}]}]} categories
 * @param {Map<string, ObjectId>} [mapping]
 * @return {any[]}
 */
function categoryIdMapping(categories, mapping) {
  return categories.reduce((map, category) => {
    map.set(category.category, category._id);
    if (category.subcategories) {
      map = categoryIdMapping(category.subcategories, map)
    }
    return map
  }, mapping || new Map())
}

(async function test() {

  const [categories, products, connection] = await Promise.all([
      fs.readFile(CATEGORIES_FILE_DATA, 'utf-8')
        .then(toJson)
        .then(transformCategories),
      fs.readFile(PRODUCTS_FILE_DATA)
        .then(toJson),
      MongoClient.connect(url, {useNewUrlParser: true}),
    ])
  ;

  const categoriesId = categoryIdMapping(categories);
  const productsWithIds = products.map(product => {
    return {
      ...product,
      categoryId: categoriesId.get(product.category),
      subcategoryId: categoriesId.get(product.subcategory)
    }
  });

  /**
   * @type Db
   */
  const db = connection.db(database);

  await Promise.all([
    db.collection(CATEGORIES_COLLECTION).insertMany(categories),
    db.collection(PRODUCTS_COLLECTION).insertMany(productsWithIds)
  ]);

  await connection.close()

})().catch(e => {
  console.error(e.message);
  process.exit(1);
});
