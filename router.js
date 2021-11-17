const express = require('express')
const router = express.Router();
const { models: {Player, Team} } = require('./db')

router.get('/players', async (req, res, next) => {
    try {
      res.send(await Player.findAll({
        include: [{
          model: Team
        }]
      }));
    }
    catch (error){
      next(error)
    }
  })
  
  router.get('/teams', async (req, res, next) => {
    try {
    res.send(await Team.findAll({
      include: [ {
        model: Player,
        as: 'playsFor'
      }]
    }));
    }
    catch(error) {
      next(error)
    }
  })
  

module.exports = router;