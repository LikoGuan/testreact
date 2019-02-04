const next = require('next');

// Must configure Raven before doing anything else with it

const dev = process.env.NODE_ENV !== 'production';
const nextapp = next({ dev });

nextapp
  .prepare()
  .then(() => {
    const app = require('./server/app')(nextapp);

    const port = 3000;
    console.log(port);
    app.listen(port, err => {
      if (err) {
        throw err;
      }
    });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
