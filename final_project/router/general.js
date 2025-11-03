const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;

    for (const bookID in books) {
        const book = books[bookID];
        if (book.ISBN === ISBN) {
            return res.send(JSON.stringify(book, null, 4));
        }
    }
    return res.send(`The book with the ISBN, ${ISBN}, cannot be found!`);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    matchingBooks = [];

    for (const bookID in books) {
        const book = books[bookID];
        if (book.author === author) {
            matchingBooks.push(book);
        }
    }
    
    if (matchingBooks.length > 0) {
        return res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.send(`The book with the author, ${author}, cannot be found!`)
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
