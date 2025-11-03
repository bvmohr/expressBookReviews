const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// --- TASK 10 IMPLEMENTATION START ---

// Function to simulate fetching the book list asynchronously
const getBookList = () => {
    return new Promise((resolve, reject) => {
        // Simulate a network delay (e.g., 500ms)
        setTimeout(() => {
            // Resolve the Promise with the books data
            resolve(books);
        }, 500); 
    });
};

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBookList();
        return res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve book list." });
    }
});

// --- TASK 10 IMPLEMENTATION END ---

// --- TASK 11 IMPLEMENTATION START ---

// Function to simulate fetching book details by ID (using the :isbn parameter)
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(`The book with the ISBN (ID) ${isbn}, cannot be found!`);
            }
        }, 500);
    });
};

// Get book details based on ISBN (ID) using async-await
public_users.get('/isbn/:isbn', async function (req, res) {

    const ISBN = req.params.isbn;
    let foundBook = null;

    for (const bookID in books) {
        const book = books[bookID];
        if (book.ISBN === ISBN) {
            foundBook = bookID;
            break;
        }
    }
    try {
        const bookDetails = await getBookByISBN(foundBook);
        return res.send(JSON.stringify(bookDetails, null, 4));
    } catch (errorMessage) {
        return res.status(404).send(errorMessage);
    }
    
});

// --- TASK 11 IMPLEMENTATION END ---
  
// --- TASK 12 IMPLEMENTATION START ---

// Function to simulate fetching book details by Author
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let matchingBooks = [];
            for (const bookID in books) {
                const book = books[bookID];
                if (book.author === author) {
                    matchingBooks.push(book);
                }
            }
            
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(`The book with the author, ${author}, cannot be found!`);
            }
        }, 500);
    });
};


// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const matchingBooks = await getBooksByAuthor(author);
        return res.send(JSON.stringify(matchingBooks, null, 4));
    } catch (errorMessage) {
        return res.status(404).send(errorMessage);
    }
});

// --- TASK 12 IMPLEMENTATION END ---

// --- TASK 13 IMPLEMENTATION START ---

// Function to simulate fetching book details based on Title
const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let foundBook = null;
            // Iterate over all books to find a match by title
            for (const bookID in books) {
                const book = books[bookID];
                if (book.title === title) {
                    foundBook = book;
                    break; 
                }
            }

            if (foundBook) {
                resolve(foundBook);
            } else {
                reject(`The book with the title, ${title}, cannot be found!`);
            }
        }, 500);
    });
};

// Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const bookDetails = await getBookByTitle(title);
        return res.send(JSON.stringify(bookDetails, null, 4));
    } catch (errorMessage) {
        return res.status(404).send(errorMessage);
    }
});
// --- TASK 13 IMPLEMENTATION END ---

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;

    for (const bookID in books) {
        const book = books[bookID];
        if (book.ISBN === ISBN) {
            if (book.reviews) {
                return res.send(`The review for ${book.title}: ` + JSON.stringify(book.reviews, null, 4));
            } else {
                return res.send(`The book, ${book.title}, does not currently have a review.`)
            }
            
        }
    }
    return res.send(`The book with the ISBN, ${ISBN}, cannot be found!`);
});

module.exports.general = public_users;
