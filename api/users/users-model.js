const db = require("../../data/db-config")
const bcrypt = require("bcryptjs")

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const allUsers = await db("users")
    .select("user_id", "username")
  return allUsers
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  return await db("users")
    .where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const [user] = await db("users")
    .select("user_id", "username")
    .where({ user_id: user_id })
  return user
}

async function findByUsername(username) {
  const [user] = await db("users")
    .select("user_id", "username", "password")
    .where({ username })
  return user
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const newUser = {
    username: user.username,
    password: bcrypt.hashSync(user.password, 10)
  }
  const [newUserID] = await db("users")
    .insert(newUser)
  const createdUser = await findById(newUserID)
  return createdUser
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findByUsername,
  findById,
  add,
}
