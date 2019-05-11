const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

// 5 series rdy

const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!,
        email: String!,
        password: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input

      type RootQuery {
        events: [Event!]!    
      }

      type RootMutation {
        createEvent(event: EventInput): Event
      }  

      schema {
        query: RootQuery,
        mutation: RootMutation
      }
    `),
    rootValue: {
      events() {
        return Event.find({})
          .then(res => {
            return res.map(event => {
              return { ...event._doc };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent(args) {
        const event = new Event({
          title: args.event.title,
          description: args.event.description,
          price: +args.event.price,
          date: new Date(args.event.date)
        });

        return event
          .save()
          .then(res => {
            return { ...res._doc };
          })
          .catch(err => {
            throw err;
          });
      }
    },
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
