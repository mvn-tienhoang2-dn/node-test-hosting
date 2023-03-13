const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowField) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowField.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.updateSelf = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('Bad request', 400));

  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'ok',
    data: { user: updatedUser },
  });
});

exports.deleteSelf = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({
    status: 'ok',
  });
});

exports.getSelf = (req, res, next) => {
  req.params.id = req.user._id.toString();
  next();
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User, {
  path: 'reviews',
  select: 'review rating',
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
