const express = require('express');
const app = express();
const cors = require('cors');
const postController = require('./routes/postController');
const routes = require('./routes/auth');

require('./models/dbConnections');
require('./models/userSchema');
require('./models/postSchema');

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(postController); 

app.listen(5500, () => {
  console.log("Server running on port 5500");
});
