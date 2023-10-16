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

  // Retrieve the user based on their userId
  const user = await User.findById(req.userId);

  // Check if the user was found
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Use the user's ID to filter the baskets
  const query = { user_id: user._id }; // Assuming user_id is the field in Basket associated with users
  //   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmQ0NWRkNWU2NjgwNDEwYzJiNDMyNyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NzQ2NTgyMSwiZXhwIjoxNzI5MDAxODIxfQ.IKf74CBNoSqcu7ggHQCzd7mfiKWeJn_VNJSWQCnSdV0
  // Remove select, sort, page, and limit from the query object
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

export const createBasket = asyncHandler(async (req, res, next) => {
  req.body.createUser = req.userId;
  const user = await User.findById(req.userId);
  const product = await Product.findById(req.params.id);
  if (!user) {
    throw new MyError(req.params.id, 401);
  }
  const basket = await Basket.create(product);

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
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    basket.createUser.toString() !== req.userId &&
    req.userRole !== "basketmin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах хэрэгтэй", 403);
  }

  const user = await User.findById(req.userId);

  basket.remove();

  res.status(200).json({
    success: true,
    data: basket,
  });
});
