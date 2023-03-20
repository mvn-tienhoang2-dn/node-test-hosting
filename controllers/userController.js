const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const extenstion = file.mimetype.split('/')[1]; // jpg, jpeg,png,...
    cb(null, `user-${req.user.id}-${Date.now()}.${extenstion}`); // user-`user-id`-timestamps.extension
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Must be an image file', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

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
  if (req.file) filteredObj.photo = req.file.filename;

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
