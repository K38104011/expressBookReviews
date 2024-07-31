const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn in books) return res.send(books[isbn]);
  return res.sendStatus(404);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookDetails = [];
  for (const isbn of Object.keys(books)) 
  {
    if (books[isbn].author === author) bookDetails.push(books[isbn]);
  }
  return res.send(bookDetails);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookDetails = [];
  for (const isbn of Object.keys(books)) 
  {
    if (books[isbn].title === title) bookDetails.push(books[isbn]);
  }
  return res.send(bookDetails);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn in books) return res.send(books[isbn].reviews);
  return res.sendStatus(404);
});

const getBooks = async () => {
  const response = await axios.get("http://localhost:5000");
  console.log(response.data)
}

getBooks();

module.exports.general = public_users;
