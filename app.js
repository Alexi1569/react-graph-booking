const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const { isAuth } = require('./middleware/isAuth');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// 5 series rdy

const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://admin:123admin@ds155396.mlab.com:55396/react-graphql-booking`
  )
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
