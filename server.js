const express = require('express');
const path = require('path')
const { syncAndSeed, db } = require('./db')
const app = express();

app.use('/', require('./router'))


const init = async () => {
  try {
    await syncAndSeed()
    await db.authenticate()
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`))
  }
  catch(error) {
      console.log(error)
  }
}

init();