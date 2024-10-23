const express = require('express');
const app = express();
const request = require('request');
const {MongoClient,ServerApiVersion} = require('mongodb');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

//const uri = "mongodb+srv://SilambarasanDev:myadminservermongodb@cluster0.vy8omlc.mongodb.net/mydataDB?retryWrites=true&w=majority";
const uri = "mongodb+srv://silambarasn:silambuhacker@cluster0.6o9my.mongodb.net/UserData?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi:ServerApiVersion.v1,
    useNewUrlParser:true,
    useUnifiedTopology: true
})


app.get('/',(req,res)=>{
    res.render('account')
})

app.get('/register',(req,res)=>{
    res.render('register',{value:""})
});

app.post('/register',async(req,res)=>{
    const newUser = {
        Name:req.body.name,
        Email:req.body.email,
        Password:req.body.password
    }
    try{
        await client.connect()
        const Db = client.db('UserData');
        const data = Db.collection("userInfo");
        const checkEmail = await data.findOne({Email:req.body.email})
        if(checkEmail){
            res.render('register',{value:"Account is already found"})
        }
        else{
            await data.insertOne(newUser);
        }
        request.get({
            url: 'https://api.api-ninjas.com/v1/quotes?category=life',
            headers: {
              'X-Api-Key': 'Z8AYbDu/gJNqW+awNbKhmg==NPXAa0dLXSVyEwMz'
            }
        },(error,response,body)=>{
            let data = JSON.parse(body);
            console.log(data[0].quote);
            res.render('home',{quote:`${data[0].quote}`,author:`${data[0].author}`})
        })  
}
    catch(err){
        console.log(err);
        res.send("error");
    }
})


app.get('/login',(req,res)=>{
    res.render('login',{value:""})
})

app.post('/login',async(req,res)=>{
    try{
        const Db = client.db('mydataDB');
        const data = Db.collection("data");
        let check = await data.findOne({Email:req.body.email})
        
        if(check){
            let result = check.Password == req.body.password;
            if(result){
                res.render('home',{quote:"Everyone needs a coach.",author:"Bill Gates"})
            }
            else{
                res.render("login",{value:"Password is Incorrect "})
            }
        }
        else{
            res.render('login',{value:"Account Not Found"})
        }
    }
    catch(error){
        res.send('Error',error)
    }
})

app.get('/login/quotes',(req,res)=>{
    res.render('home',{quote:"",author:""});
});

app.post('/login/quotes',(req,res)=>{
    request.get({
        url: 'https://api.api-ninjas.com/v1/quotes?category=life',
        headers: {
          'X-Api-Key': 'Z8AYbDu/gJNqW+awNbKhmg==NPXAa0dLXSVyEwMz'
        },
      }, (error, response, body) => {
            if(error){
                return console.error('Request failed:', error);
            }
            else if(response.statusCode != 200){
                return console.error('Error:', response.statusCode, body.toString('utf8'));
            }
            else{
               let data = JSON.parse(body);
               res.render('home',{quote:`${data[0].quote}`,author:`${data[0].author}`})
            }
      });
})



app.listen(3000)