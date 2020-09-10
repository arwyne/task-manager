const express = require("express");
// no need to grab anything, by simply calling require that is going to ensure that the file runs and its ensure that the mongoose is connected to database
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// without middleware: new request -> run route handler
// with middleware: new request -> do something -> run route handler
// the position of middleware is important, it must be before the route
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled");
//   } else {
//     next();
//   }
// });

// middleware for maintenance mode
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!");
// });

// express automatically parse incoming json to an object, so that req parameter is not undefined in post
app.use(express.json());

// routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "sikretongmalupet", {
//     expiresIn: "7 days",
//   });

//   const data = jwt.verify(token, "sikretongmalupet");
// console.log(data);
// };

// myFunction();
