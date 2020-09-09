require("../src/db/mongoose");
const User = require("../src/models/user");

// 5f55054d8c65b336341322a7

// User.findByIdAndUpdate("5f5507d493ab582d1835cc69", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const updateAgeandCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: age });
  const count = await User.countDocuments({ age: age });
  return count;
};

updateAgeandCount("5f55054d8c65b336341322a7", 2)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
