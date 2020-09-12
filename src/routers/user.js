const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save(); // eitherway its working even its not here due to there is save in generateToken???
    sendWelcomeEmail(user.email, user.name);
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

// logout on individual device
router.post("/users/logout", auth, async (req, res) => {
  try {
    // remove current token
    // iterating the array of tokens, if the array token is not equal to current token it will return true and will keep it
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// logout all at once
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // empty array
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  // get the user on req.user from auth
  const user = req.user;
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
    updatesProperty.forEach((updateProperty) => {
      user[updateProperty] = updates[updateProperty];
    });

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const _id = req.user._id; //get it on the auth middleware
  try {
    await req.user.remove(_id);
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // when fail (1st arg)
      return cb(new Error("Please upload an image"));
    }

    // when sucess (1st arg, 2nd arg)
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
