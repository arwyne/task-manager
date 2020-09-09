require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5f55ce865a4c72048c627b0b")
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const deleteTaskandCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskandCount("5f54fb445d76ec17ecefde44")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
