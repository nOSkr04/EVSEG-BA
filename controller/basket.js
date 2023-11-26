import Basket from "../models/Basket.js";
import path from "path";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
// api/v1/baskets
export const getBaskets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const query = { createUser: user._id };
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Basket.find(query));

  const baskets = await Basket.find(query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: baskets.length,
    data: baskets,
    pagination,
  });
});

export const getBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id);
  //   .populate({
  //     path: "createUser",
  //     select: "firstName profile",
  //   });

  if (!basket) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: basket,
  });
});
export const updateBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id);
  if (!basket) {
    throw new MyError(req.params.id + " ID-тэй сагс байхгүй байна.", 404);
  }
  const quantity = req.body.quantity;
  const user = await User.findById(basket.createUser)
  if (!user) {
    throw new MyError(req.params.id, 401);
  }
  basket.quantity = quantity
  await basket.save();
  await user.save();

  //   .populate({
  //     path: "createUser",
  //     select: "firstName profile",
  //   });


  res.status(200).json({
    success: true,
    data: basket,
  });
});

export const createBasket = asyncHandler(async (req, res, next) => {
  const productId = req.body.productId;
  const product = await Product.findById(productId);
  const size = req.body.size;
  const quantity = req.body.quantity;
  if(quantity === 0 && !quantity) throw new MyError("Validtaion Error",400)
  const availableCount = (product.size).filter((i)=> i.name === size)[0]
  console.log(availableCount)
  const user = await User.findById(req.userId);
  if (!user) {
    throw new MyError(req.params.id, 401);
  }

  const basket = await new Basket({
    product: productId,
    name: product.name,
    size,
    quantity,
    availableCount : availableCount.quantity,
    price: product.price * quantity,
    category: product.category,
    subCategory: product.subCategory,
    image: product.image,
    createUser: req.userId
  }).save();
  
  user.basketNumber += 1;
  user.save();

  res.status(200).json({
    success: true,
    data: basket,
  });
});

export const deleteBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id);

  if (!basket) {
    throw new MyError(req.params.id + " ID-тэй юм байхгүй байна.", 404);
  }

  basket.remove();
  const user = await User.findById(req.userId);

  user.basketNumber -= 1; 

  res.status(200).json({
    success: true,
    data: basket,
  });
});
export const saveProduct = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;
  const user = await User.findById(req.userId);
  const product = await Product.findById(req.params.id);
  if (!user) {
    throw new MyError(req.params.id, 401);
  }
  const basket = await Basket.create(product);

  await basket.save();
  console.log("availabeCount",req.body.availableCount)
  user.savedProduct += req.body.availableCount;
  await user.save();

  res.status(200).json({
    success: true,
    data: basket,
  });
});
