//jshint esversion: 6

require("dotenv").config();
const express = require('express'),
bodyParser = require('body-parser'),
ejs = require('ejs'),
_ = require('lodash'),
mongoose = require('mongoose'),
path = require("path"),
app = express();

let PORT = process.env.PORT;

if (PORT == "" || PORT == null){
    PORT = 3000;
}

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
aboutStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
contactStartingContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(bodyParser.urlencoded({extended: true}));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + "/public/"));

// setting up mongoose
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});
const Post = mongoose.model("Post", postSchema);

app.get('/', async (req, res)=> {
    const allPosts = await Post.find({});
    res.render("home.ejs", {
        homeContent: homeStartingContent,
        posts: allPosts
    });
});

app.get('/about', (req, res)=> {
    res.render("about.ejs", {
        aboutContent: aboutStartingContent
    });
});

app.get('/contact', (req, res)=> {
    res.render("contact.ejs", {
        contactContent: contactStartingContent
    });
});

app.get('/compose', (req, res)=> {
    res.render("compose.ejs");
});

app.get('/post/:topic', async (req, res)=> {
    const requestedTitle = _.lowerCase(req.params.topic);

    const findTitle = await Post.findOne({name: requestedTitle});

    if (findTitle !== null){
        res.render("post.ejs", {
            title: findTitle.name,
            body: findTitle.body
        });
    }
    else{
        res.redirect("/");
    }
});

app.post("/compose", async (req, res)=> {

    const post = new Post({
        name: _.lowerCase(req.body.postTitle),
        body: req.body.postBody
    });

    await post.save();
    res.redirect("/");
});

app.listen(PORT, ()=> {
    console.log('Server ported at port 3000');
})
