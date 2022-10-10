const express = require('express')
const {
    Helper,
    ErrorCodes,
    ErrorMessage,
    CustomException,
    Db: { paginate: Paginate },
    Logger,
  } = require("../utils");
  const { Product } = require('../models/product')
  const { FileManager } = require('../service')


  const parseQuery = ({price, search, reviews, rating, active }) => {
    const and =[]
    let query = {}

    if(price){
    const a = String(price).split(",");
    const pr = { $or: [] };
    a.forEach((_) => {
      const [from, to] = _.split("-");
      if (to === "*") {
        pr.$or.push({ price: { $gte: from } });
      } else {
        pr.$or.push({
          price: {
            $gte: from,
            $lte: to,
          },
        });
      }
    });
    and.push(pr);
    }

    if (search) {
        const sea = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
        and.push(sea);
      }
      if (rating) query = { rating, ...query };
      if (reviews) {
        const a = String(reviews).split(",");
        const rev = { $or: [] };
        a.forEach((_) => {
          const [from, to] = _.split("-");
          if (to === "*") {
            rev.$or.push({ numReviews: { $gte: from } });
          } else {
            rev.$or.push({
              numReviews: {
                $gte: from,
                $lte: to,
              },
            });
          }
        });
        and.push(rev);
      }
    if (active)
      query = {
        ...query,
        isActive: active,
      };
    if (and.length > 0) {
      query = { ...query, $and: and };
    }
    return query;  

  }

  const handleResult = (product, res, next) => {
    if(product){
        res.json({ data: product });
    }else{
        res.status(404);
    next(
      new CustomException(
        ErrorMessage.PRODUCT_NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND
      )
    ); 
    }
  }

  const sanitizeBody = function (body) {
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.numReviews;
    delete body.reviews;
    delete body.rating;
    delete body.image;
    delete body.public_id;
  };

  /**
 * check if the review data from the body has user, rating and comment
 * @param  {object} review
 * @param  {function} next
 * @return {boolean}
 */
  function checkReview (review, next){
    const { user, rating, comment } = review
    if(user &&
        rating &&
        comment &&
        Helper.checkId(user) &&
        Helper.checkRating(rating) &&
        Helper.checkComment(comment)
        ){
            return true
        }
        next(
            new CustomException(
              // eslint-disable-next-line new-cap
              ErrorMessage.INVALID_REVIEWS,
              ErrorCodes.INVALID_REVIEWS
            )
          );
          return false;   
  }

  /** returns all products
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const getAllProducts  = async function (req, res, next){
    const query = parseQuery(req.query)
    const { page, prepage } = req.query
    Paginate(res, next, Product, {
        perPage: perpage,
        query,
        page,
        projections: { countInStock: 0 },
        populate: { path: "reviews.user", select: "name email" },
      });
}

/**
 * Get specific product record
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */

const getProduct = async function (req, res, next){
    const { id } = req.params
    if (!Helper.checkId(id)) {
        next(
          new CustomException(
            // eslint-disable-next-line new-cap
            ErrorMessage.PRODUCT_NOT_FOUND,
            ErrorCodes.PRODUCT_NOT_FOUND
          )
        );
        return;
      }
    Product.findById(id, {countInStock: 0})
    .populate({ path: "reviews.user", select: "name email" })
    .then((product) => {
        handleResult(product, res, next);
    })  
}

/**
 * Adds new product 
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
 const addProduct = async function (req, res, next) {
    if (Helper.checkPayload(req.user || {})) {
      const { body } = req;
       log.info('new product data', body) 
      if (!("name" in body) || !("price" in body)) {
        res.status(422);
        return next(
          new CustomException(
            ErrorMessage.REQUIRED_NAME_PRICE,
            ErrorCodes.REQUIRED_NAME_PRICE
          )
        );
      }
      if (!("description" in body)) {
        res.status(422);
        return next(
          new CustomException(
            ErrorMessage.REQUIRED_DESCRIPTION,
            ErrorCodes.REQUIRED_DESCRIPTION
          )
        );
      }
  
      const isValid = Helper.validateBody(
        ["name", "price", "description"],
        body,
        res,
        next
      );
      if (!isValid) return false;
  
      log.info("passed validation");
      const { name, price, description } = body;
  
      const validProduct = new Product({
        name,
        price,
        description,
      });
  
      if (req.file !== undefined) {
        log.info(req.file);
        if (!req.file.path) {
          log.error("error saving image", {
            file: "product.js add(image)",
          });
        } else {
          validProduct.image = req.file.path;
          validProduct.public_id = req.file.filename;
        }
      }
      await validProduct.save();
      return handleResult(validProduct, res, next);
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };

  
  /**
 * updates a single product
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const updateProduct = async function (req, res, next) {
    const {
      params: { id },
      body,
    } = req;
    if (Helper.checkPayload(req.user || {}) && Helper.checkId(id)) {
      sanitizeBody(body);
      const newData = [];
      if (body.name) newData.push("name");
      if (body.price) newData.push("price");
      if (body.description) newData.push("description");
  
      const isValid = Helper.validateBody(newData, body, res, next);
      if (!isValid) return false;
      return Product.findByIdAndUpdate(id, body, { new: true })
        .then(async (product) => {
          if (req.file !== undefined) {
            log.info(req.file);
            if (!req.file.path) {
              log.error("error saving image", {
                file: "product.js update(image)",
              });
            } else {
              // delete previous file
              if (product && product.public_id) {
                FileManager.deleteCloud(product.public_id || "");
              }
              if (product) {
                product.image = req.file.path;
                product.public_id = req.file.filename;
                await product.save();
                log.info("New file uploaded");
              }
            }
          }
          return handleResult(product, res, next);
        })
        .catch((err) => {
          return next(err);
        });
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };

  /**
 * delete a product
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const deleteProduct = async function (req, res, next) {
    const { params } = req;
    if (Helper.checkPayload(req.user || {}) && Helper.checkId(params.id)) {
      return Product.findByIdAndRemove(params.id).then((product) => {
        if (product && product.public_id) {
          FileManager.deleteCloud(product.public_id || "");
        }
        return handleResult(product, res, next);
      });
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };

  
  /**
 * adds a review
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const addReview = async function (req, res, next) {
    const {
      params: { id },
      body: { review },
    } = req;
    if (Helper.checkPayload(req.user || {}) && Helper.checkId(id)) {
      const reviewN = { ...review, user: req.user.id };
      const isValid = checkReview(reviewN, next);
      if (!isValid) return false;
  
      const product = await Product.findById(id);
      if (!product) return handleResult(product, res, next);
      try {
        await product.addReview(reviewN);
      } catch (err) {
        log.info(err);
        return next({ error: err });
      }
      await product.save();
      return handleResult(product, res, next);
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };


  /**
 * updates a review
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const updateReview = async function (req, res, next) {
    const {
      params: { id },
      body: { review },
    } = req;
    if (Helper.checkPayload(req.user || {}) && Helper.checkId(id)) {
      const reviewN = { ...review, user: req.user.id };
      const isValid = checkReview(reviewN, next);
      if (!isValid) return false;
  
      const product = await Product.findById(id);
      if (!product) return handleResult(product, res, next);
      try {
        await product.editReview(reviewN);
      } catch (err) {
        log.info(err);
        return next({ error: err });
      }
      await product.save();
      return handleResult(product, res, next);
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };

  /**
 * deletes a single review
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
const deleteReview = async function (req, res, next) {
    const {
      params: { id },
    } = req;
    if (Helper.checkPayload(req.user || {}) && Helper.checkId(id)) {
      const product = await Product.findById(id);
      if (!product) return handleResult(product, res, next);
      try {
        await product.deleteReview(req.user.id);
      } catch (err) {
        log.info(err);
        return next({ error: err });
      }
      await product.save();
      return handleResult(product, res, next);
    }
    return next(
      new CustomException(
        // eslint-disable-next-line new-cap
        ErrorMessage.NO_PRIVILEGE,
        ErrorCodes.NO_PRIVILEGE
      )
    );
  };
  
  module.exports = {
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    addReview,
    updateReview,
    deleteReview
  }