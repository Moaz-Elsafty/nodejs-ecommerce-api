const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/apiError");
const ApiFeatures = require("../utlis/apiFeatures");

//  @desc     Get list of documents
//  @access   Public

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // Build query
    const documentCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .pagination(documentCounts)
      .fitler()
      .sort()
      .limitFields()
      .search(modelName);

    //Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

//  @desc     Get specific document by id
//  @access   Public

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) building query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) execute query
    const document = await query;
    if (!document) {
      // res.status(404).json({ message: `No Brand for this id ${id}` });
      return next(new ApiError(`No data for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

//  @desc     Create document
//  @access   Private

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    // you can hash the pass before being stored in the database by the next line or use mongoose middleware(pre"save") in the schema file
    // req.body.password = await bcrypt.hash(req.body.password, 12);
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

//  @desc       Update specific
//  @access     Private
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      // res.status(404).json({ message: `No brand for this id ${id}` });
      return next(new ApiError(`No data for this id ${req.params.id}`, 404));
    }

    // Triggers "save" event when update document >> specially in updating reviews
    document.save();
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      // res.status(404).json({ message: `No product for this id ${id}` });
      return next(new ApiError(`No data for this id ${id}`, 404));
    }

    // Triggers "remove" event when delete document >> specially in deleting reviews
    // await document.remove();

    res.status(204).send();
  });

// find a solution for the ApiError msg to be compateble withe the Model name
