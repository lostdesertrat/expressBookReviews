const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const userExists = users.some(user => user.username === username);
  if (userExists) {

    return true;
  } else {
    return false;
  }

  const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  //only registered users can login
  regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Add a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    if (books[isbn]) {
      if (!books[isbn].reviews) {
        books[isbn].reviews = {};
      }
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
}


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
