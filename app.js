const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = process.env.PORT || 4000;
const app = express();

const events = [];

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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

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
        return events;
      },
      createEvent(args) {
        const event = {
          _id: Math.random().toString(),
          title: args.event.title,
          description: args.event.description,
          price: +args.event.price,
          date: args.event.date
        };

        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
