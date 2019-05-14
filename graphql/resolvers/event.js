const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('../../helpers/transform');

module.exports = {
  async events() {
    try {
      const res = await Event.find({});
      return res.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  async createEvent(args, req) {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }

      const event = new Event({
        title: args.event.title,
        description: args.event.description,
        price: +args.event.price,
        date: new Date(args.event.date),
        creator: req.userId
      });

      let createdEvent;

      const res = await event.save();
      createdEvent = transformEvent(res);
      const user = await User.findById(req.userId);

      if (!user) {
        throw new Error('User not found');
      }
      user.createdEvents.push(event);

      await user.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};
