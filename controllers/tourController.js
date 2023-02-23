const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      tour: tour,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Invalid Id',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const createdTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      tour: createdTour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'bad request',
    });
  }
};

exports.updateTour = async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
