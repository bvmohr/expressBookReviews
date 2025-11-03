const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    //  Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; 

    // Get the username from the session (set during login)
    const username = req.session.authorization.username;

    let bookForReview = null;
    // Check if book exists
    for (const bookID in books) {
        const book = books[bookID];
        if (book.ISBN === isbn) {
            bookForReview = book;
            break;
        }
    }
    if(!bookForReview) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Initialize reviews object if it doesn't exist
    if (!bookForReview.reviews) {
        bookForReview.reviews = {};
    }

    // Check if the user has already posted a review
    if (bookForReview.reviews.hasOwnProperty(username)) {
        // User already reviewed: Modify/update the existing review
        booksForReview.reviews[username] = review;
        return res.status(200).json({ 
            message: `Review for ISBN ${isbn} successfully modified by user ${username}: ${review}.` 
        });
    } else {
        // New user review: Add a new entry
        bookForReview.reviews[username] = review;
        return res.status(200).json({ 
            message: `Review for ISBN ${isbn} successfully added by user ${username}:  ${review}.` 
        });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Get the username from the session (set during login)
    const username = req.session.authorization.username;

    let bookForReview = null;
    // Check if book exists
    for (const bookID in books) {
        const book = books[bookID];
        if (book.ISBN === isbn) {
            bookForReview = book;
            break;
        }
    }
    if(!bookForReview) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
    if (bookForReview.reviews[username]) {
        let review = bookForReview.reviews[username];
        bookForReview.reviews = {};
        return res.status(200).json({ 
            message: `Review for ISBN ${isbn} successfully deleted by user ${username}: ${review}.` 
        });
    } else {
        return res.status(200).json({
            message: `There are no reviews for ISBN ${isbn} by user ${username}.`
        })
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
