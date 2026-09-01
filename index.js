const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override'); 
const ejsMate = require("ejs-mate");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs", ejsMate);

let posts = [
  {
    id: uuidv4(),
    username: "sujaysm04",
    content: "This is my first post",
  },
  {
    id: uuidv4(),
    username: "sujaysm05",
    content: "I love coding",
  },
  {
    id: uuidv4(),
    username: "sujaysm06",
    content: "welcome!",
  }
]

app.get('/posts', (req, res) => {
  res.render("index.ejs",{ posts: posts });    
});

app.get('/posts/new', (req, res) => {
  res.render("new.ejs");
});

app.post('/posts', (req, res) => {
  let {username, content} = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect('/posts');
});

// app.get("/posts/:id", (req, res) => {
//   let { id } = req.params;
//   let post = posts.find((post) => id === post.id);
//   res.render("show.ejs",{post});
// });

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).send("Post not found. Go back to /posts and select a post again.");
  }

  res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((post) => id === post.id);
  post.content = newContent;
  console.log(post);
  res.redirect("/posts");

});
  
// app.get("/posts/:id/edit", (req, res) => {
//   let { id } = req.params;
//   let post = posts.find((post) => id === post.id);
//   res.render("edit.ejs");
// });

app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((post) => id !== post.id);
  res.redirect("/posts");
});

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});