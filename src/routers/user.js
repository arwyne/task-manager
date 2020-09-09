const express = require("express");
const User = require("../models/user");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); // eitherway its working even its not here due to there is save in generateToken???
    const token = await user.generateAuthToken();
    res.status(201).send({ user: user, token: token });
    // res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // res.send(user);
    res.send({ user: user, token: token });
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/:id", async (req, res) => {
  //to get the :id
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = req.body;
  const updatesProperty = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updatesProperty.every((updateProperty) => {
    return allowedUpdates.includes(updateProperty);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(_id);

    updatesProperty.forEach((updateProperty) => {
      user[updateProperty] = updates[updateProperty];
    });

    await user.save();

    // const user = await User.findByIdAndUpdate(_id, updates, {
    //   // return the modifed document rather than the original
    //   new: true,
    //   // run update validators
    //   runValidators: true,
    // });
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;