const Users = require("../users/users-model")
const bcrypt = require("bcryptjs")
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: "You shall not pass!"
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  const searchedUsername = await Users.findByUsername(username)
  if (!searchedUsername) {
    next()
  } else {
    next({
      status: 422,
      message: "username taken"
    })
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const { username } = req.body
  if (username) {
    next()
  } else {
    next({
      status: 401,
      message: "Invalid credentials"
    })
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if (password && password.length > 3) {
    next()
  } else {
    next({
      status: 422,
      message: "Password must be longer than 3 chars"
    })
  }
}

async function validateUsername(req, res, next) {
  const { username } = req.body
  const userFromDB = await Users.findByUsername(username)
  if (!userFromDB) {
    next({
      message: "invalid credentials",
      status: 401
    })
  } else {
    next()
  }
}

async function validatePassword(req, res, next) {
  const { username, password } = req.body
  const userFromDB = await Users.findByUsername(username)
  const verifiedPassword = bcrypt.compareSync(password, userFromDB.password)
  if (!verifiedPassword) {
    next({
      message: "invalid credentials",
      status: 401
    })
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  validateUsername,
  validatePassword,
}
