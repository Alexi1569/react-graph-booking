const User = require('../models/user');
const Event = require('../models/event');
const { dateToString } = require('./date');

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: getUser.bind(this, event._doc.creator)
  };
};

const getUser = async id => {
  try {
    const user = await User.findById(id);

    return {
      ...user._doc,
      createdEvents: getEvents.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);

    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const getEvents = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });

    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getEvents,
  getEvent,
  getUser
};
