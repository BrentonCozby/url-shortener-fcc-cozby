var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

const mongoUrl = process.env.MONGOLAB_URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.post('/shorten', (req, res) => {
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) return console.log('Unable to connect to mongoDB server. Error: ', err);
        const collection = db.collection('urls');
        var path;

        collection.find().toArray((err, allDocs) => {
            path = allDocs[0].count;
        });

        collection.find({
            longUrl: req.body.urlInput
        }).toArray((err, data) => {
            if(err) return console.log(err);

            if (data.length === 0) {
                collection.update(
                    {count: {$exists: true}},
                    {$inc: {count: 1}}
                );

                path++;

                collection.insert({longUrl: req.body.urlInput, path: +path}, () => {
                    db.close();
                });
            } else {
                path = data[0].path;
                db.close();
            }

            var shortenedUrl = 'https://url-shortener-fcc-cozby.heroku.com/short/' + path;
            // var shortenedUrl = 'localhost:5000/short/' + path;

            res.send(shortenedUrl);
        });
    });
});

app.get('/short/:path', (req, res) => {
    MongoClient.connect(mongoUrl, (err, db) => {
        db.collection('urls').find({path: +req.params.path}).toArray((err, data) => {
            db.close();
            var url = data[0].longUrl;

            if(data[0].longUrl.split('http').length === 1) {
                url = 'http://' + url;
            }

            res.redirect(url);
        });
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
