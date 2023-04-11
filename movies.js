var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var upload = multer();
var router = express.Router();
module.exports = router;

var app = express();



app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

//Require the Router we defined in tickets.js
var tickets = require('./tickets.js');

//Use the Router on the sub route /tickets
app.use('/tickets', tickets);

app.listen(3000);

router.get('/', function(req, res){
   res.json(tickets);
});

var tickets = [
    {id: 101, name: "Night Club", desc: "A place to party at night", type: "Building"},
    {id: 102, name: "Inscription", desc: "An engraved writing", type: "Writing"},
    {id: 103, name: "Dark Knight", desc: "A knight with dark coloring", type: "Person"},
    {id: 104, name: "Angry Man", desc: "a someone displeased individual", type: "Person"}
 ];
 
 //Routes will go here
 module.exports = router;

 router.get('/:id([0-9]{3,})', function(req, res){
    var currTicket = tickets.filter(function(ticket){
       if(ticket.id == req.params.id){
          return true;
       }
    });
    if(currTicket.length == 1){
       res.json(currTicket[0])
    } else {
       res.status(404);//Set status to 404 as ticket was not found
       res.json({message: "Not Found"});
    }
 });

 router.post('/', function(req, res){
    //Check if all fields are provided and are valid:
    if(!req.body.name ||
       !req.body.desc ||
       !req.body.type ){
       
       res.status(400);
       res.json({message: "Bad Request"});
    } else {
       var newId = tickets[tickets.length-1].id+1;
       tickets.push({
          id: newId,
          name: req.body.name,
          desc: req.body.desc,
          type: req.body.type
       });
       res.json({message: "New ticket created.", location: "/tickets/" + newId});
    }
 });

 router.put('/:id', function(req, res){
   //Check if all fields are provided and are valid:
   if(!req.body.name ||
      !req.body.desc ||
      !req.body.type ||
      !req.params.id.toString().match(/^[0-9]{3,}$/g)){
      
      res.status(400);
      res.json({message: "Bad Request"});
   } else {
      //Gets us the index of ticket with given id.
      var updateIndex = tickets.map(function(ticket){
         return ticket.id;
      }).indexOf(parseInt(req.params.id));
      
      if(updateIndex === -1){
         //ticket not found, create new
         tickets.push({
            id: req.params.id,
            name: req.body.name,
            desc: req.body.desc,
            type: req.body.type
         });
         res.json({message: "New ticket created.", location: "/tickets/" + req.params.id});
      } else {
         //Update existing ticket
         tickets[updateIndex] = {
            id: req.params.id,
            name: req.body.name,
            desc: req.body.desc,
            type: req.body.type
         };
         res.json({message: "Ticket id " + req.params.id + " updated.", 
            location: "/tickets/" + req.params.id});
      }
   }
});
