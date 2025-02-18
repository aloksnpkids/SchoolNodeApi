const _ = require("lodash");
const config = require('config');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {School, User} = require('../database/models/index.model');
const JWT_SECRET = config.get('JWT_PRIVATE_KEY');

 



async function register(req, res) {
  const { name, email, password, mobile_no, first_name, last_name } = req.body;

  try {
      // Check if school already exists
      let school = await School.findOne({ where: { name } });

      if (!school) {
          // Create new school entry if not found
          school = await School.create({
              name,
              address: '', // Address can be updated later or fetched from the payload
              contact_email: email,
              contact_phone: mobile_no,
          });
      }

      // Check if user with the same email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(400).json({
              message: 'User with this email already exists.',
          });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user entry
      const user = await User.create({
          name: `${first_name} ${last_name}`,
          email,
          password: hashedPassword,
          role_id: 2, // Assuming '2' is the role ID for a standard user (adjust as needed)
          school_id: school.id,
      });

      // Generate JWT token
      const token = jwt.sign(
          { id: user.id, email: user.email, role_id: user.role_id },
          JWT_SECRET,
          { expiresIn: '12h' } // Token validity (adjust as needed)
      );

      return res.status(201).json({
          message: 'User registered successfully!',
          user: {
              id: user.id,
              name: user.name,
              email: user.email,
              school: school.name,
          },
          token,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: 'Something went wrong!',
          error: error.message,
      });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
      // Find user by email
      const user = await User.scope('withPassword').findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({
              message: 'User not found.',
          });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({
              message: 'Invalid credentials.',
          });
      }

      // Generate JWT token
      const token = jwt.sign(
          { id: user.id, email: user.email, role_id: user.role_id },
          JWT_SECRET,
          { expiresIn: '1h' } // Token validity (adjust as needed)
      );

      return res.status(200).json({
          message: 'Login successful!',
          user: {
              id: user.id,
              name: user.name,
              email: user.email,
          },
          token,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: 'Something went wrong!',
          error: error.message,
      });
  }
}


  


module.exports.register = register;
module.exports.login = login;