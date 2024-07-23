const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.findIndex((user) => user.username === username) === -1;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.findIndex((user) => user.username === username && user.password === password) !== -1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(404).json({ message: "Error logging in" });

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else
    return res
      .status(208)
      .json({ message: "Invalid login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;

  if (isbn in books) {
    books[isbn].reviews[username] = review;
    return res.send(`The review by user '${username}' for the book with ISBN ${isbn} has been updated.`);
  }

  return res.sendStatus(404);
});

// Deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (isbn in books & username in books[isbn].reviews) {
    delete books[isbn].reviews[username];
    return res.send(`The review by user '${username}' for the book with ISBN ${isbn} has been deleted.`);
  }

  return res.sendStatus(404);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
