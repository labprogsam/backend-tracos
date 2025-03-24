import 'dotenv/config';

import app from './app.js';
import database from './database/index.js';

// ================ DATABASE ================ //
database
  .authenticate()
  .then(() => {
    console.log('Connection to the database established successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// ================ RUN SERVER ================ //
const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
