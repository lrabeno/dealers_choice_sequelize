const Sequelize = require('sequelize');

const { STRING, UUID, UUIDV4 } = Sequelize; 

const db = new Sequelize(process.env.DATABASE_URL || 'nba_players_teams', 'postgres', 'ask admin for permission', {
    host: 'localhost',
    dialect: 'postgres'
  });


const Player = db.define('player', {
    playerName: {
        type: STRING(30),
        allowNull: false, 
        unique: true
    },
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    }
})

const Team = db.define('team', {
    teamName: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        
    }
})

Team.belongsTo(Player, {as: 'playsFor'});
Player.hasMany(Team, {foreignKey: 'playsForId'});


const syncAndSeed = async() => {
    await db.sync({ force: true })
    
    /* CREATED PLAYERS */
    const [rjBarret, stephCurry, 
        lebronJames, giannisAntetokounmpo] = await Promise.all(
            ['Rj Barrett', 'Steph Curry', 
            'Lebron James', 'Giannis Antetokounmpo']
            .map(playerName => Player.create({ playerName }))
        )
    
    /* CREATED TEAMS */
    const [knicks, lakers, bucks, warriors, allStars] = await Promise.all(
        ['Knicks', 'Lakers', 'Bucks', 'Warriors', 'All-Stars']
        .map(teamName => Team.create({ teamName }))
        )
    
       knicks.playsForId = rjBarret.id;
       lakers.playsForId = lebronJames.id;
       warriors.playsForId = stephCurry.id;
       bucks.playsForId = giannisAntetokounmpo.id;
       allStars.playsForId = lebronJames.id;
    
    await Promise.all([rjBarret.save(), stephCurry.save(), 
        lebronJames.save(), giannisAntetokounmpo.save(),
         allStars.save(), warriors.save(), bucks.save(), lakers.save(),
         knicks.save()]);
  
}

module.exports = {
    syncAndSeed,
    models: {
      Player, 
      Team
    },
    db
}