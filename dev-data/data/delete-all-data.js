const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
async function deleteData() {
  // await Tour.deleteMany();
  // await User.deleteMany();
  await Review.deleteMany();
  process.exit();

  //   const promises = [Tour.deleteMany(), User.deleteMany(), Review.deleteMany()];
  //   return Promise.all(promises)
  //     .then(() => {
  //       console.log('Data successfully deleted!');
  //       const data = {
  //         name: 'Tien Hoang',
  //         password: '12341234',
  //         passwordConfirm: '12341234',
  //         email: 'tien123@gmail.com',
  //         role: 'admin',
  //       };
  //       return User.create(data);
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => {
  //     });
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connect ok!');
    deleteData();
  });
