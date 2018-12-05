import {CREATED, BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';
import loki from 'lokijs';
import express from 'express';
import basic from 'express-basic-auth';

var port = process.env.PORT || 8080;
var app = express();
app.use(express.json());
const admin = basic({ users: { admin: 'admin' }});

// Datenbank und Guest Collection erstellen
var db = new loki('Database Partyadministation');
var guests = db.addCollection('guests');
// var parties = db.addCollection('parties');

// Beispiel insert von einem Guest
/*
var max = guests.insert({
    firstName: 'Max',
    lastName: 'Mustermann'
});
*/


// Get request von http://localhost:8080/party
app.get('/party', function (request, response, next) {
    response.send({
        title: 'birthday party',
        location: 'at home',
        date: new Date(2019, 4, 2)
      });
  });

// Get request von http://localhost:8080/guests
app.get('/guests', admin, function (request,response){
    response.send(guests.find());
    // Wenn man z.B. guests mit namen max haben möchte dann:
    /*res.send(guests.find({
        'first name': 'Max'
    }));*/
});

// Post request von http://localhost:8080/register
app.post('/register', function(request,response, next){
    var fname = request.body.firstName;
    var lname = request.body.lastName;

    if(fname != null || lname != null){
        if(guests.count() < 10){
            var guest = guests.insert({firstName: fname, lastName: lname});
            response.status(CREATED).send(guest);
        } else {
            response.status(UNAUTHORIZED).send('Reached max amount of guests!')
        }
    } else {
        response.status(BAD_REQUEST).send('No names defined!');
    }
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);