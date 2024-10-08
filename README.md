# E-Commerce REST API

A fully-featured REST API for an e-commerce platform built with Node.js, Express, and MongoDB. This project supports a range of core e-commerce features and includes comprehensive validation, security, and performance optimization.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)

### Features

- **Error Handling**: Structured error handling for internal and external app issues.
- **Models**: Schemas for brands, categories, products, and more.
- **Data Validation**: Ensures data integrity and security through validation on CRUD operations.
- **Image Upload & Processing**: Supports file upload with processing capabilities.
- **User Authentication & Authorization**: Secure login, registration, and permissions.
- **Business Logic**: Supports reviews, wishlist, coupons, shopping cart, and more.
- **Payment Processing**: Supports cash and online payments.

### Technologies Used

- Nodejs, Express, Mongoose

- **Data Fetching**: All data fetched through `GET` requests supports the following:
  - **Filters**: Apply custom filters to refine results based on various criteria.
  - **Pagination**: Retrieve data in chunks to improve load times and usability.
  - **Sorting**: Organize results based on selected fields (e.g., price, rating).
  - **Search**: Keyword-based search to find relevant results efficiently.
  - **Field Limiting**: Choose specific fields to include or exclude from the response.

### Usage

npm run start:dev

### API Endpoints

#### Categories

- **GET /api/v1/categories**: Fetch all categories
- **GET /api/v1/categories/:id**: Fetch a single category by ID
- **POST /api/v1/categories**: Create a new category (Admin and Manager only)
- **PUT /api/v1/categories/:id**: Update a category by ID (Admin and Manager only)
- **DELETE /api/v1/categories/:id**: Delete a category by ID (Admin only)

#### Subcategories

- **GET /api/v1/subcategories**: Fetch all subcategories
- **GET /api/vq/subcategories/:id**: Fetch a single subcategory by ID
- **POST /api/v1/subcategories**: Create a new subcategory (Admin and Manager only)
- **PUT /api/v1/subcategories/:id**: Update a subcategories by ID (Admin and Manager only)
- **DELETE /api/v1/subcategories/:id**: Delete a subcategories by ID (Admin only)

#### Brands

- **GET /api/v1/brands**: Fetch all brands
- **GET /api/vq/brands/:id**: Fetch a single brand by ID
- **POST /api/v1/brands**: Create a new brand (Admin and Manager only)
- **PUT /api/v1/brands/:id**: Update a brand by ID (Admin and Manager only)
- **DELETE /api/v1/brands/:id**: Delete a brand by ID (Admin only)

#### Products

- **GET /api/v1/products**: Fetch all products
- **GET /api/v1/products/:id**: Fetch a product by ID
- **POST /api/v1/products**: Create a new product (Admin and Manager only)
- **PUT /api/v1/products/:id**: Update a product by ID (Admin and Manager only)
- **DELETE /api/v1/products/:id**: Delete a product by ID (Admin only)

#### Users

- **GET /api/v1/users**: Fetch all users (Admin only)
- **GET /api/v1/users/:id**: Fetch a user by ID
- **PUT /api/v1/users/:id**: Update user details (Admin only)
- **PUT /api/v1/users/changePassword/:id**: Update user password (Admin only)
- **DELETE /api/v1/users/:id**: Delete a user (Admin only)
- **GET /api/v1/users/getMe**: Fetch a user by ID
- **PUT /api/v1/users/updateMe**: Update user details (User only)
- **PUT /api/v1/users/updatePass**: Update user password (User only)
- **DELETE /api/v1/users/deleteMe**: Delete a user (User only)

#### Auth

- **POST /api/v1/auth/signup**: Register a new user
- **POST /api/v1/auth/login**: User login
- **POST /api/v1/auth/forgotPassword**: Initiate password reset
- **POST /api/v1/auth/verifyResetCode**: Validate user request
- **POST /api/v1/auth/resetPassword**: Reset password

#### Reviews

- **GET /api/v1/products/reviews**: Get all reviews
- **POST /api/v1/products/reviews**: Create a review for a product
- **PUT /api/v1/reviews/:id**: Update a review by ID
- **DELETE /api/v1/reviews/:id**: Delete a review by ID

#### Wishlist

- **GET /api/v1/wishlist**: Fetch wishlist items for the logged-in user
- **POST /api/v1/wishlist**: Add a product to wishlist
- **DELETE /api/v1/wishlist/:productId**: Remove a product from wishlist

#### Addresses

- **GET /api/v1/addresses**: Fetch user addresses
- **POST /api/v1/addresses**: Add a new address
- **DELETE /api/v1/addresses/:addressId**: Delete an address by ID

#### Coupons

- **GET /api/v1/coupons**: Fetch all coupons (Admin and Manager only)
- **GET /api/v1/coupons/:id**: Fetch a coupon (Admin and Manager only)
- **POST /api/v1/coupons**: Create a new coupon (Admin and Manager only)
- **PUT /api/v1/coupons/:id**: Update a coupon (Admin and Manager only)
- **DELETE /api/v1/coupons/:id**: Delete a coupon by ID (Admin and Manager only)

#### Cart

- **GET /api/v1/cart**: Get cart items for the logged-in user
- **POST /api/v1/cart**: Add items to the cart
- **PUT /api/v1/cart/:itemId**: Update quantity of an item in the cart
- **DELETE /api/v1/cart/:itemId**: Remove an item from the cart

#### Orders

- **GET /api/v1/orders**: Fetch all orders (Admin, Manager and there is a filter query for getting the user orders only)
- **GET /api/v1/orders/:id**: Fetch order details by ID
- **POST /api/v1/orders/:cartId**: Place an order (User creates a cash order)
- **POST /api/v1/orders/checkout-session/:cartId**: Place an order (User creates an online order)
- **PUT /api/v1/orders/:id/pay**: Update order status to paid
- **PUT /api/v1/orders/:id/deliver**: Update order status to deliverd

### Planned Features

- Cart Expiry: Automatically clear items from the cart if left unattended for more than 24 hours using a cron job.
- Email Reminders:
- - Send a notification email to users 1 hour after items are added to the cart, encouraging checkout.
- - Send a follow-up reminder email after 4 hours to remind users to proceed with their purchases, using customizable email templates.
