var express = require('express');
var router = express.Router();
var jump = require('../jump')

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
      await jump.refreshScreencap()

  } catch (e){
    console.log(e)
  }

  res.render('index', { title: 'Jump One Jump' });
});

module.exports = router;
