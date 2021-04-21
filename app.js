//jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
  extended: true
}));

const port = process.env.PORT || "1337";

app.set("port", port);
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/sparksbank', {useNewUrlParser: true, useUnifiedTopology: true});

const customerschema= new mongoose.Schema({
  name: String,
  email :String,
  accountno:Number,
  balance:Number
});

const historyschema= new mongoose.Schema({
  sender: String,
  reciever: String,
  amount: Number
})

const customer=mongoose.model("customer",customerschema);
const history=mongoose.model("history",historyschema);


app.get("/", function(req, res) {

  res.render("index");

});

app.get("/customers",function(req,res){

  customer.find({}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
        res.render("customers", { details: allDetails })
    }
});
});

app.get("/transactionlist",function(req,res){

  history.find({}, function (err, hdetails) {
    if (err) {
        console.log(err);
    } else {
        res.render("transactionlist", { history: hdetails })
    }
});
});

app.get("/tranferfund",function(req,res){
  res.render("tranferfund");
});

app.get("/success",function(req,res){
  res.render("success");
});

app.get("/failure",function(req,res){
  res.render("failure");
});


app.post("/customers",function(req,res){
  var ms=req.body.sender;
  var mr=req.body.reciever;
  var ma=req.body.amount;

  customer.findOne({ name: ms }, function (err, senderdetails) {
    if(err){
      console.log(err);
    }
    else{
      // console.log(senderdetails.balance)
      var osm=senderdetails.balance;
      if(osm>ma){
        var st=(Number(osm)-Number(ma));
        customer.updateOne({name: ms},{balance:st},function(err){
          if(err){
            console.log(err);
          }else{
            console.log("success");
            history.create({sender:ms,reciever:mr,amount:ma},function(err){
              if(err){
                console.log(err);
              }
              else{
                console.log("success");
              }
            });
          }
        });
        customer.findOne({ name: mr }, function (err, recieverdetails) {
          if(err){
            console.log(err);
          }
          else{
            var orm=recieverdetails.balance;
            var rt=(Number(orm)+Number(ma));
            customer.updateOne({name:mr},{balance:rt},function(err){
              if(err){
                console.log(err);
              }else{
                res.redirect("/success");
              }
            });

          }
        });

      }
      else{
        res.redirect("/failure");
      }
    }
  });


});


app.listen(port, () => console.log(`Server running on localhost:${port}`));
