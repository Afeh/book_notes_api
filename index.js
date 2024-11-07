import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import methodOverride from "method-override";

const app = express();
const port = 3000;


app.use(methodOverride("_method"));

const db = new pg.Client({
	user: "postgres",
	host:"localhost",
	database: "book_notes",
	password: "postgres",
	port: 5432,
});

async function getImgUrl (isbn) {
	let url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
	console.log(url);
	return url;
}

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index.ejs");
});

app.post("/add", async (req, res) => {
	let imgUrl;

	const name = req.body.name;
	const author = req.body.author;
	const yearPublished = req.body.yearPublished;
	const rating = req.body.rating;
	const review = req.body.review;
	const summary = req.body.summary;// replace with function
	const isbn = req.body.isbn;
	const bookUrl = req.body.bookUrl; 
	const genre = req.body.genre;

	imgUrl = await getImgUrl(isbn);

	try {
		await db.query(
			"INSERT INTO book_detail (name, author, year_published, rating, review, summary, img_url, isbn, amazon_url, genre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
			[name, author, yearPublished, rating, review, summary, imgUrl, isbn, bookUrl, genre]
		);
		res.render("add.ejs");
	} catch (err) {
		console.log(err);
	}
	
});

app.get("/books", async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM book_detail");

		res.json(result.rows);
	} catch (err) {
		console.log(err);
	}
});

app.get("/books/:id", async (req, res) => {
	const id = parseInt(req.params.id);

	try {
		const result  = await db.query(
			"SELECT * FROM book_detail WHERE id = ($1)", [id]
		);
		// console.log(result.rows);
		res.json(result.rows[0]);
	} catch (err) {
		console.log(err);
	}
});


app.get("/edit-book/:id", async (req, res) => {
	const id = parseInt(req.params.id);

	try {
		const result = await db.query("SELECT * FROM book_detail WHERE id = ($1)", [id]);

		if (result.rows.length === 0){
			return res.status(404).send("Book not found");
		}

		res.render("edit.ejs", { book: result.rows[0], bookId: id});
	} catch (error) {
		console.log(error);
		res.status(500).send("An error occurred while trying to retrieve the book")
	}
});


app.patch("/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const {name, author, yearPublished, rating, review, summary, img_url, isbn, amazon_url, genre } = req.body;

	try {
		// console.log("Book data:", {name, author, yearPublished, rating, review, summary, img_url, isbn, amazon_url, genre });
		const result = await db.query(
			`UPDATE book_detail 
			SET name = $1, author = $2, year_published = $3, rating = $4, review = $5, summary = $6, 
				isbn = $7, amazon_url = $8, genre = $9 
			WHERE id = $10 RETURNING *`,
			[name, author, yearPublished, rating, review, summary, isbn, amazon_url, genre, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Book not found "});
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An error occurred while updating book details" })
	}
});

app.get("/book-delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);

	try {
		const result = await db.query("SELECT * FROM book_detail WHERE id = ($1)", [id]);

		if (result.rows.length === 0){
			return res.status(404).send("Book not found");
		}

		res.render("delete.ejs", {bookId: id});
	} catch (error) {
		console.log(error);
		res.status(500).send("An error occurred while trying to retrieve the book")
	}
});

app.delete("/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);

	try {
		await db.query(
			"DELETE FROM book_detail WHERE id = ($1)", [id]
		);
		res.redirect("/books");
	} catch (error) {
		console.log(error);
	}
});


app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
})