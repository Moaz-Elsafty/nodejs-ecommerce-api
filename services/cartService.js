const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/apiError");

const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  // calculate total cart price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

//  @desc     Add product to cart
//  @route    POST  /api/v1/cart
//  @access   Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // product exist in cart, update product quantity if same color
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    // console.log(productIndex);
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart, push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    message: "Product added to cart successfully",
    data: cart,
  });
});

//  @desc     Get logged user cart
//  @route    GET  /api/v1/cart
//  @access   Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @desc     Remove product from cart
//  @route    Delete  /api/v1/cart/:itemId
//  @access   Private/User
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);

  if (!cart.cartItems.length) {
    return next(
      new ApiError(`The cart is empty for this user id: ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @desc     Clear logged user cart
//  @route    Delete  /api/v1/cart
//  @access   Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//  @desc     Update specific cart item quantity
//  @route    PUT  /api/v1/cart/:itemId
//  @access   Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  // if the condition of findIndex did not verified the itemmIndex will = -1
  if (itemIndex < 0) {
    return next(
      new ApiError(`The item with id ${req.params.itemId} does not exist`)
    );
  }
  // update quantity
  cart.cartItems[itemIndex].quantity = quantity;

  calcTotalCartPrice(cart);

  cart.save();

  res.status(200).json({
    status: "success",
    message: "Quantity updated successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart.cartItems[itemIndex],
  });
});

//  @desc     APply coupon on logged user cart
//  @route    PUT  /api/v1/cart/applyCoupon
//  @access   Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount =
    totalPrice - ((totalPrice * coupon.discount) / 100).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
