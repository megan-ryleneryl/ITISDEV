const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

// Set up Handlebars as the view engine
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Serve static files from the public directory
app.use('/public', express.static('public'));

// Example data
const chats = [
  { id: 1, name: "Marco Santos", date: "06/28/24" },
  { id: 2, name: "Leslie Valdez", date: "06/25/24" },
  { id: 3, name: "Philip Sosa", date: "06/24/24" }
];

const messages = [
  { type: "Driver", name: "Marco", details: "Hello, I'll pick you up at 9 AM." },
  { type: "Rider", name: "John", details: "Thank you! See you then." }
];

// Route for chat list
app.get('/', (req, res) => {
  res.render('chat-list', { isChatList: true, chats });
});

// Route for chat interface
app.get('/chat/:id', (req, res) => {
  const chat = chats.find(c => c.id == req.params.id);
  res.render('chat', { isChatList: false, chat, messages });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
