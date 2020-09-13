const express = require("express");
// no need to grab anything, by simply calling require that is going to ensure that the file runs and its ensure that the mongoose is connected to database
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
// const port = process.env.PORT || 3000;
// const port = process.env.PORT;

// middleware for maintenance mode
// position of code is important
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!");
// });

// express automatically parse incoming json to an javascript object, so that req parameter is not undefined in post
// object to json?? due to request
app.use(express.json());

// routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

// app.listen(port, () => {
//   console.log("Server is up on port " + port);
// });
