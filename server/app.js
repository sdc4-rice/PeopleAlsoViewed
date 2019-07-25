const express = require('express');
const cors = require('cors');
const db = require('./db/index.js').sequelize;
require('dotenv').config();

const port = process.env.PORT;

const app = express();

app.set('port', port);

app.use(express.static('public'));

app.use(cors());

// returns all alsovieweditems
app.get('/api/alsovieweditems', (req, res) => {
  const queryString = 'select * from ViewedItem';
  const queryArgs = [];

  db.query(queryString, queryArgs, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      res.end();
    } else {
      console.log(results)
      res.status(200).json(results);
      res.end();
    }
  });
});

// returns all categoryids assigned to items
app.get('/api/alsovieweditems/categoryids', (req, res) => {
  const queryString = 'select categoryid from alsovieweditems';
  const queryArgs = [];

  db.query(queryString, queryArgs, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      res.end();
    } else {
      const categoryids = [];
      for (let i = 0; i < results.length; i += 1) {
        if (!categoryids.includes(results[i].categoryid)) {
          categoryids.push(results[i].categoryid);
        }
      }
      res.status(200).json(categoryids);
      res.end();
    }
  });
});

// return list of items with given categoryid
app.get('/api/alsovieweditems/categoryid/:categoryId', (req, res) => {
  const queryString = 'select * from alsovieweditems where categoryid = ?';
  const queryArgs = [req.params.categoryId];

  db.query(queryString, queryArgs, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      res.end();
    } else {
      res.status(200).json(results);
      res.end();
    }
  });
});

// returns items within given range
app.get('/api/alsovieweditems/startid/:startId/endid/:endId', (req, res) => {
  const queryString = 'select * from alsovieweditems where id >= ? and id <= ?';
  const queryArgs = [req.params.startId, req.params.endId];

  db.query(queryString, queryArgs, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      res.end();
    } else {
      res.status(200).json(results);
      res.end();
    }
  });
});

app.listen(app.get('port'), () => {
  console.log(`peopleAlsoViewed is listening on : ${app.get('port')}`);
});

module.exports = app;
