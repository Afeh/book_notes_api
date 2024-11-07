# Book Notes App

The Book Notes App is a web application built using Express.js, PostgreSQL, and EJS templates. It allows users to manage their book collection by adding, editing, and deleting book details.

## Features

1. **Add Book**: Users can add new books to the database by providing details such as book name, author, year published, rating, review, summary, ISBN, Amazon URL, and genre.
2. **View Book List**: Users can view a list of all the books in the database.
3. **View Book Details**: Users can view detailed information about a specific book.
4. **Edit Book**: Users can edit the details of an existing book.
5. **Delete Book**: Users can delete a book from the database.

## Installation

1. Fork this repository

2. Clone the repository:
	```bash
	git clone https://github.com/your-username/book_notes_api.git
	
	cd real_estate_api
	```

3. Install the requried dependencies:
	```bash
	npm i
	```

4. Set up the PostgreSQL database:

- Create a new database named `book_notes`.
- Update the database connection details in the index.js file:
	```javascript
	const db = new pg.Client({
		user: "your-postgres-username",
		host: "localhost",
		database: "book_notes",
		password: "your-postgres-password",
		port: 5432,
	});
	```

- Create a table in the database
	```SQL
	CREATE TABLE book_detail (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		author VARCHAR(255) NOT NULL,
		year_published INTEGER,
		rating INTEGER,
		review TEXT,
		summary TEXT,
		img_url TEXT,
		isbn VARCHAR(13),
		amazon_url TEXT,
		genre VARCHAR(50)
	);
	```

5. Start the development Server:
	```bash
	node index.js
	```

- The development server would be available at `http://localhost:3000`.


## API Endpoints

## GET /books 
- Retrive all the books in the database. 
- Returns a JSON Array containing book details.

## GET /books/:id 
- Retrieve details of a specific book by its ID.
- Requires an ID parameter in the URL path.
- Returns a JSON Object containing book details.

## POST /add
- Adds a new book entry to the database.
- Expects form data containing book details (name, author, yearPublished, review, summary, isbn, book_url, genre).

## PATCH /edit/:id
- Updates the details of a specific book.
- Requires an ID parameter in the URL path.
- Expects data in the request body containing the updated book details.
- Returns a JSON object containing book details.

## DELETE /delete/:id
- Deletes a specific book from the database.
- Requires an ID parameter in the URL path.
- Redirects to the /books endpoint after successful deletion.


## Technologies Used

- Express.js: Web application framework for Node.js
- PostgreSQL: Relational database for storing book details
- EJS: Templating engine for rendering HTML pages
- method-override: Middleware for handling HTTP method overrides
- bodyParser: Middleware for parsing request bodies
- pg: PostgreSQL client for Node.js
