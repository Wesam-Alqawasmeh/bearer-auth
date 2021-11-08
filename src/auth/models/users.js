'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const API_SECRET = process.env.SECRET

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, API_SECRET);
      }
    }
  });

  // model.beforeCreate(async (user) => {
  //   let hashedPass = bcrypt.hash(user.password, 5);
  //   user.password = hashedPass;
  // });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({where:{ username: username }});
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
    // if (valid) {
    //   let newToken = jwt.sign({ username: user.username }, API_SECRET);
    //   user.token = newToken;
    //   return user;
    // } else {
    //   throw new Error('Invalid User');
    // }
  }

  // Bearer AUTH: Validating a token
  model.authenticateBearer = async function (token) {
    try {
      const parsedToken = jwt.verify(token, API_SECRET);
      const user = await this.findOne({where: { username: parsedToken.username }})
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = userSchema;