const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

// ********* EXPRESS - NUNJUCKS - BODYPARSER *********
const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// ********* MIDDLEWARES *********
const checkAgeMid = (req, res, next) => {
  if (Object.keys(req.query).length !== 0) {
    next();
  } else {
    res.render('main');
  }
};

// ********* GET ROUTES *********
app.get('/', (req, res) => {
  res.render('main');
});

app.get('/minor', checkAgeMid, (req, res) => {
  res.render('minor', { nome: req.query.nome });
});

app.get('/major', checkAgeMid, (req, res) => {
  res.render('major', { nome: req.query.nome });
});

// ********* POST ROUTES *********
app.post('/check', (req, res) => {
  const idade = moment().diff(moment(req.body.date, 'YYYY/MM/DD'), 'years');

  if (idade > 18) {
    res.redirect(`major?nome=${req.body.name}`);
  } else {
    res.redirect(`minor?nome=${req.body.name}`);
  }

  res.send();
});
// ********* END *********

app.listen(3000);
