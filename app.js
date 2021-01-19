//jshint esversion:6

// custom set up
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
// helper dependency library / Load the full build
const _ = require("lodash");
// require mongoose
const mongoose = require("mongoose");


// variable holding content for display
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// create mongoose database and connection to url and database
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

// create mongoose schema
const blogSchema = {
  title: String,
  content: String
};

// create collection using mongoose model
const Post = mongoose.model("Post", blogSchema);

// create default document in blog database
const defaultPost = new Post({
  title: "New Home",
  content:homeStartingContent 
});

// set ejs view engine
app.set('view engine', 'ejs');

// custom set up
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// home route get function call
app.get("/", function(req, res) {
// query post database
Post.find({}, function(err, foundItem){
  res.render("home", {
    homeParagraph: homeStartingContent,
    posts: foundItem
   });
});
});

// about route get function call
app.get("/about", function(req, res){
  res.render("about", {aboutParagraph: aboutContent });
}); 

// contact route get function call
app.get("/contact", function(req, res){
  res.render("contact", {contactParagraph: contactContent });
});

// compose route get function call
app.get("/compose", function(req, res) {
  res.render("compose" );
});

// catch compose route post request function 
app.post("/compose", function(req, res){
  const post = new Post({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

//query url endpoint route parameter function 
app.get("/posts/:postName", function (req, res) {
  // by using lodash helper function
  const postTitles = _.lowerCase(req.params.postName);
  //query database to return items
  Post.find({}, function(err, foundItem){
     // loop thru posts array and compare with postTiles
    foundItem.forEach(function(post){
      const storeTile = _.lowerCase(post.title);
      if (postTitles === storeTile ){
        res.render("post",{
          title: post.title,
          content: post.content
        });
      };
    });
    
  });
 
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
