require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

router.get("/", isLoggedIn, async (req, res) => {
  const { Student } = req.context.models;
  res.json(
    await Student.find().catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.get("/:department", isLoggedIn, async (req, res) => {
  const { Student } = req.context.models;
  var dept  = req.params['department'];
  console.log("Department:",dept)
  res.json(
    await Student.find({department : dept}).catch((error) =>
      res.status(400).json({ error })
    )
  );
});


// Signup route to create a new user
router.post("/signup", async (req, res) => {
  const { Student } = req.context.models;
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await Student.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  const { Student } = req.context.models;
  try {
    // check if the user exists
    const user = await Student.findOne({ email: req.body.email });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        console.log(SECRET)
        const token = await jwt.sign({ email: user.email, user:"student" }, SECRET);
        res.json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Student doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});


// Login route to verify a user and get a token
router.post("/update", isLoggedIn, async (req, res) => {
  const { Student } = req.context.models;
  try {
    // check if the user exists
    const user = await Student.findOne({ email: req.body.email });
    req.body.updated = Date.now
    if (user) {
      //check if password matches
      await Student.updateOne({ email: req.body.email }, req.body);
      // send updated user as response
      const user = await Student.findOne({ email: req.body.email });
      res.json(user);
    } else {
      res.status(400).json({ error: "Student doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;