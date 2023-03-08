const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendingToken = (code, userId, message, res) => {
  const token = genToken(userId);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(code).json({
    status: message,
    data: {
      token,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  return sendingToken(201, user._id, 'success', res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Emaill or password cannot null', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new (AppError('Email was wrong', 400))());
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError('Password was wrong', 400));
  }
  return sendingToken(200, user._id, 'Login successfully', res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in!', 401));

  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const loggedUser = await User.findById(id);

  if (!loggedUser)
    return next(new AppError('This token is invalid please login again', 401));

  if (loggedUser.changedPasswordAfter)
    return next(
      new AppError('User recently change password, please login again', 401)
    );

  req.user = loggedUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(`You don't have permission`, 403));
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // find by anything
  const user = await User.findOne({ email: req.body.email });
  //return fail while not find user
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/reset-password/${resetToken}`;

  const message = `Forgot your password? Click url below \n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Password Reset in 10m`,
      message: message,
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Send email has been fail', 500));
  }

  res.status(200).json({
    status: `Success`,
    message: `Email has been sent`,
  });
});
exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return sendingToken(200, user._id, 'Reset password success', res);
};

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new AppError('undefined user', 404));

  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError('Old password is incorrect', 400));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  return sendingToken(201, user._id, 'success', res);
});
