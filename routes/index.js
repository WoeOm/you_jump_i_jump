var express = require('express');
var router = express.Router();
var jump = require('../jump')

/* GET home page. */
router.get('/', async function(req, res, next) {
  await jump.refreshScreencap()
  res.render('index', { title: 'Jump One Jump' });
});

module.exports = router;
