const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  // Check if a user with the given username already exists
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password
  })
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  console.log('req.session :>> ', req.session)
  const username = req.body.username
  const password = req.body.password

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' })
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 }
    )

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send('User successfully logged in')
  } else {
    return res.status(208).json({ message: 'Invalid Login. Check username and password' })
  }
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const currentUsername = req.session.authorization.username
  let wasReviewUpdated = typeof books[req.params.isbn].reviews[currentUsername] !== 'undefined'
  books[req.params.isbn].reviews[currentUsername] = req.body.myreview
  return res.status(200).send('Review was ' + (wasReviewUpdated ? 'updated' : 'saved') + ' successfully')
})

// Delete a book review using isbn and current logged in user
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const currentUsername = req.session.authorization.username
  delete books[req.params.isbn].reviews[currentUsername]
  return res.status(200).send('Review was deleted successfully')
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
module.exports.authenticatedUser = authenticatedUser
