const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Setup Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Store todos in memory (in a real app, you'd use a database)
let todos = [];

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        todos: todos
    });
});

app.post('/todo/add', (req, res) => {
    const todo = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };
    todos.push(todo);
    res.redirect('/');
});

app.post('/todo/toggle/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
        return todo;
    });
    res.redirect('/');
});

app.post('/todo/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;