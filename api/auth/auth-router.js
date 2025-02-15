// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require("express").Router()
const Users = require("../users/users-model")
const bcrypt = require("bcryptjs")
const {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  validateUsername,
  validatePassword,
} = require("./auth-middleware")

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post("/register",
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      const createdUser = await Users.add({ username, password })
      res.status(200).json({
        user_id: createdUser.user_id,
        username: createdUser.username
      })
    } catch (err) {
      next(err)
    }
  })

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.post("/login", validateUsername, validatePassword, async (req, res, next) => {
  try {
    const { username } = req.body
    const userFromDB = await Users.findByUsername(username)
    req.session.user = userFromDB
    res.status(200).json({
      message: `Welcome ${username}`
    })
  } catch (err) {
    next(err)
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

router.get("/logout",
  async (req, res, next) => { // eslint-disable-line
    if (!req.session.user) {
      res.status(200).json({ message: "no session" })
    } else {
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({ message: "failed to logout" })
        } else {
          res.status(200).json({ message: "logged out" })
        }
      })
    }
  }
)




// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router
