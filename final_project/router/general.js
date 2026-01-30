const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;
	if (username && password) {
		if (!isValid(username)) {
			users.push({ username: username, password: password });
			return res.status(200).json({ message: "User registered successfully" });
		} else {
			return res.status(404).json({ message: "Username already exists" });
		}
	}

	return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
	//Write your code here
	try {
		const fetchBooks = new Promise((resolve, reject) => {
			if (books) resolve(books);
			else reject("No books available");
		});

		const allBooks = await fetchBooks;
		return res.status(200).send(JSON.stringify(allBooks, null, 4));
	} catch (error) {
		return res.status(500).json({ message: "Error retrieving book list", error });
	}
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
	//Write your code here
	try {
		const getIsbn = new Promise((resolve, reject) => {
			const isbn = req.params.isbn;
			if (books[isbn]) resolve(books[isbn]);
			else reject("Book not found");
		});

		const bookNumber = await getIsbn;
		return res.status(200).send(JSON.stringify(bookNumber, null, 4));
	} catch (error) {
		return res.status(500).json({ message: "Error retrieving book details", error });
	}
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
	//Write your code here
	try {
		const getAuthor = new Promise((resolve, reject) => {
			const author = req.params.author;
			const authorBooks = Object.values(books).filter((book) => book.author === author);
			if (authorBooks.length > 0) resolve(authorBooks);
			else reject("No books found for the given author");
		});

		const authorName = await getAuthor;
		return res.status(200).send(JSON.stringify(authorName, null, 4));
	} catch (error) {
		return res.status(500).json({ message: "Error retrieving book details", error });
	}
});
// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
	//Write your code here
	try {
		const getTitle = new Promise((resolve, reject) => {
			const title = req.params.title;
			const titleBooks = Object.values(books).filter((book) => book.title === title);
			if (titleBooks.length > 0) resolve(titleBooks);
			else reject("No books found with the given title");
		});

		const bookTitle = await getTitle;
		return res.status(200).send(JSON.stringify(bookTitle, null, 4));
	} catch (error) {
		return res.status(500).json({ message: "Error retrieving book details", error });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	const book = books[isbn];

	if (book && book.reviews) {
		return res.status(200).json({ message: "Book reviews found", reviews: book.reviews });
	} else {
		return res.status(404).json({ message: "Book or reviews not found" });
	}
});

module.exports.general = public_users;
