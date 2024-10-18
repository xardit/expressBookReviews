const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password })
      return res.status(200).json({ message: 'User successfully registered. Now you can login' })
    } else {
      return res.status(404).json({ message: 'User already exists!' })
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: 'Unable to register user.' })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(books)
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn])
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  return res.status(200).json(Object.values(books).find(({ author }) => author === req.params.author))
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(200).json(Object.values(books).find(({ title }) => title === req.params.title))
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn].reviews)
})

module.exports.general = public_users
