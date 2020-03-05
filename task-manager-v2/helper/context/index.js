import jwt from 'jsonwebtoken';

import User from '../../database/models/user';

const verifyUser = async req => {
  try {
    req.email = null;
    req.loggedInUser = null;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRETE);
      req.email = payload.email;

      const user = await User.findOne({ email: payload.email });
      req.loggedInUser = user.id;
    }
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
};

export default verifyUser;
