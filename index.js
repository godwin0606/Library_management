const express = require("express")
const mysql2 = require('mysql2')
const cors = require('cors')

const app = express()



const db = mysql2.createConnection({

    host : "localhost",
    user : "root",
    password : "9559",
    database : "test"
})


app.use(express.json())
app.use(cors())



app.get('/', (req,res)=>{

    res.json("Hello this is the backend")
})



app.get('/books', (req,res)=>{

    const q = "SELECT * FROM books"

    db.query(q,(err,data)=>{

        if(err) return res.json(err)

        return res.json(data)
    })
})


app.get('/books/:id', (req, res) => {
    const id = req.params.id; // Retrieve id from route parameters

    const q = 'SELECT * FROM books WHERE id = ?'; // Use a parameterized query

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error('Error fetching book:', err);
            return res.status(500).json({ error: 'Failed to fetch book' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json(data[0]); // Return the book object
    });
});



app.get('/books/:title', (req, res) => {
    const title = req.params.title;

    if (!title) {
        return res.status(400).json({ error: 'Title parameter is required' });
    }

    const q = 'SELECT * FROM books WHERE title = ? LIMIT 1';

    db.query(q, [title], (err, data) => {
        if (err) {
            console.error('Error fetching book with title:', title, err);
            return res.status(500).json({ error: 'Failed to fetch book' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: `Book not found ${title}` });
        }

        return res.json({ success: true, data: data[0] });
    });
});




app.post('/books', (req,res)=>{

    const q = "INSERT INTO books(`title`,`description`,`price`,`cover`) VALUES (?)"

    const values = [req.body.title,req.body.description,req.body.price,req.body.cover]

    db.query(q, [values] , (err,data)=>{

        if(err) return res.json(err)

            console.log("Book has been created");
            

        return res.json(data)
    })
})




// app.put('/books/:id', (req, res) => {
//     const { id } = req.params;
//     const { title, description, price, cover } = req.body;

//     const q = 'UPDATE books SET title = ?, description = ?, price = ?, cover = ? WHERE id = ?';

//     const values = [title, description, price , cover];

//     db.query(q, [values], (err, result) => {
//         if (err) {
//             console.error('Error updating book:', err);
//             return res.status(500).json({ error: 'Failed to update book' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Book not found' });
//         }

//         return res.json({ message: 'Book updated successfully' });
//     });
// });


app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price, cover } = req.body;

    const q = 'UPDATE books SET title = ?, description = ?, price = ?, cover = ? WHERE id = ?';

    const values = [title, description, price, cover, id]; // Ensure id is included here

    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Error updating book:', err);
            return res.status(500).json({ error: 'Failed to update book' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json({ message: 'Book updated successfully' });
    });
});




  app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    const q = 'DELETE FROM books WHERE id = ?';

    db.query(q, [id], (err, result) => {
        if (err) {
            console.error('Error deleting book:', err);
            return res.status(500).json({ error: 'Failed to delete book' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json({ message: 'Book deleted successfully' });
    });
});

  


app.listen(8080,()=>{

    console.log("Connected backend");
    
})