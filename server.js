const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});

var express = require('express');
const app = express();

const bodyParser =require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
const db = getFirestore();

const { render } = require('ejs');

app.use(express.static('Project'));
var passwordHash = require('password-hash');
app.get('/dashboard', function (req, res) {  
res.sendFile( __dirname + "/Project/" + "dash.html" );
})  
app.get('/login', function (req, res) {  
    res.sendFile( __dirname + "/Project/" + "login.html" );
    })  
 
app.get('/signup', function (req, res) {  
    res.sendFile( __dirname + "/Project/" + "signup.html" );
    })
app.post('/signupSubmit', function (req, res) {  
  console.log(req.body);
  db.collection('SignUpData')
  .where("email","==",req.body.email)
  .get()
  .then((docs) => {
    if(docs.size>0){
        res.send("<h1>This Account already exists</h1><br><br><br><h2>Please <a href='/login'>login</a></h2><br><h2>Or Try Again With Another Email</h2>");
    }
    else{
   db.collection('SignUpData').add({
     FullName: req.body.FullName,
     email:req.body.email,
     password:passwordHash.generate(req.body.password)
 }).then(() =>{
  res.sendFile( __dirname + "/Project/" + "login.html" );
 })
}
})
 })
  app.post('/loginSubmit', function (req, res) {  
  console.log(req.body.email)
  db.collection('SignUpData')
  .where("email","==",req.body.email)
  .get()
  .then((docs) => {
    var verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().password)
    });
      console.log(docs.size)
      if(verified){
        res.sendFile(__dirname + "/Project/" + "searchBar.html");
      }
      else{
        res.send("<h1>Please <b><a href='/signup'>SIGNUP</a></b> first or ENTER THE CORRECT PASSWORD  <a href='/login'>login</a></h1>")
      }
    })
  })
  
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})