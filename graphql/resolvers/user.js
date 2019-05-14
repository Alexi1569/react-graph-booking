const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
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
  async login({ email, password }) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User does not exist');
      }

      const isPasswordEqual = await bcrypt.compare(password, user.password);

      if (!isPasswordEqual) {
        throw new Error('Password is incorrect');
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'supersecretkey',
        {
          expiresIn: '1h'
        }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1
      };
    } catch (err) {
      throw err;
    }
  }
};
