require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;


// Department Wise Filtering included
// http://localhost:4000/alumni/?department=CSE
router.get("/", isLoggedIn, async (req, res) => {
  const { Alumni } = req.context.models;
  if(req.query.department){
    var dept  = req.query.department
    console.log("Department:",dept)
    res.json(
      await Alumni.find({department : dept}).catch((error) =>
        res.status(400).json({ error })
      )
    );
  }
  else{
    res.json(
      await Alumni.find().catch((error) =>
        res.status(400).json({ error })
      )
    );
  }
});

router.get("/filter",isLoggedIn,async(req,res)=>{
  const { Alumni }= req.context.models;
  var query = {}
  if(req.body.department){
    query.department=req.body.department
  }
  if(req.body.areasOfInterest){
    query.areasOfInterest={ $all: req.body.areasOfInterest}
  }
  if(req.body.before && req.body.after){
    query.yearGraduation={ $gte: req.body.after, $lte: req.body.before }
  }
  else if(req.body.after){
    query.yearGraduation={ $gte: req.body.after}
  }
  else if(req.body.before){
    query.yearGraduation={ $lte: req.body.before}
  }
  console.log("QUERY :",query)
  res.json(
    await Alumni.find(query).catch((error) =>
      res.status(400).json({ error })
    )
  );
  
})




// Signup route to create a new user
router.post("/signup", async (req, res) => {
  const { Alumni } = req.context.models;
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await Alumni.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});




// Update route to update details
router.post("/update", isLoggedIn, async (req, res) => {
  const curUserId  = req.user.userId;
  const { Alumni } = req.context.models;
  try {
    // check if the user exists
    const user = await Alumni.findOne({userId: curUserId  });
    req.body.updated = Date.now()
    if (user) {
      //check if password matches
      await Alumni.updateOne({userId: curUserId  }, req.body);
      // send updated user as response
      const user = await Alumni.findOne({userId: curUserId  });
      res.json(user);
    } else {
      res.status(400).json({ error: "Alumni doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});


module.exports = router;