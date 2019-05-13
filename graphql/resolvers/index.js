const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/Booking');

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

    return {
      ...event._doc,
      creator: getUser.bind(this, event._doc.creator)
    };
  } catch (err) {
    throw err;
  }
};

const getEvents = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });

    return events.map(event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  async events() {
    try {
      const res = await Event.find({});
      return res.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: getUser.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  async createEvent(args) {
    try {
      const event = new Event({
        title: args.event.title,
        description: args.event.description,
        price: +args.event.price,
        date: new Date(args.event.date),
        creator: '5cd916fd58770c17846f8606'
      });

      let createdEvent;

      const res = await event.save();
      createdEvent = {
        ...res._doc,
        date: new Date(res._doc.date).toISOString(),
        creator: getUser.bind(this, res._doc.creator)
      };
      const user = await User.findById('5cd916fd58770c17846f8606');

      if (!user) {
        throw new Error('User not found');
      }
      user.createdEvents.push(event);

      await user.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
  async createUser(args) {
    try {
      const isUserExists = await User.findOne({ email: args.user.email });

      if (isUserExists) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(args.user.password, 12);

      const user = new User({
        email: args.user.email,
        password: hashedPassword
      });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  async bookings() {
    try {
      const res = await Booking.find({});

      return res.map(booking => {
        return {
          ...booking._doc,
          user: getUser.bind(this, booking._doc.user),
          event: getEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  async bookEvent(args) {
    const event = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: '5cd9179c5317261bd82b0ad1',
      event
    });

    const result = await booking.save();

    return {
      ...result._doc,
      user: getUser.bind(this, booking._doc.user),
      event: getEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  },
  async cancelBooking(args) {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        creator: getUser.bind(this, booking.event._doc.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
};
