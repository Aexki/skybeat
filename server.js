const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mysql = require('mysql')
const player = require('play-sound')(opts = {})
const con = mysql.createConnection({
    host: 'devworkshop.c2ozhyrxzjwg.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'devworkshop',
    database: 'mydb'
})

app.use(bodyParser.urlencoded({ extended: false }))

var currentsong;
con.query("select song from team2 where votes=(select max(votes) from team2)", function(err, result, fields) {
    if (err) throw err;
    currentsong = result[0].song
})

player.play(currentsong + '.mp3', function(err) {
    if (err) throw err
})

// function setsong() {
//     con.query("select song from team2 where votes=(select max(votes) from team2)", function(err, result, fields) {
//         if (err) throw err;
//         currentsong = result[0].song
//     })
// }
// setTimeout(setsong, 300000);

app.get('/', function(req, res) {
    res.render("frontend.ejs", { name: 'aexki', music: currentsong })
})

app.post('/upvote/:name', function(req, res) {
    var n = req.params.name
    con.query("select votes from team2 where slno=" + n, function(err, result, fields) {
        if (err) throw err;
        var newa = (result[0].votes + 1)
        con.query("update team2 set votes=" + newa + " where slno=" + n, function(err, result, fields) {
            if (err) throw err;
            console.log('Upvoted Song: ' + n)
        })
        res.redirect('/')
    })
})

app.get('/playlist', function(req, res) {
    con.query("select * from team2 group by votes desc", function(err, result, fields) {
        if (err) throw err;
        res.render("playlist.ejs", { name: 'aexki', details: result, music: currentsong })
    })
})

// listen for requests :)
const listener = app.listen(3000, function() {
    console.log("Your app is listening on port " + listener.address().port);
});