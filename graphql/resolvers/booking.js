const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('../../helpers/transform');

module.exports = {
  async bookings(args, req) {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }

      const res = await Booking.find({});

      return res.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  async bookEvent(args, req) {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const event = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: req.userId,
      event
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  async cancelBooking(args, req) {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }

      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
};
