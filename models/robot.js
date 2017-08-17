const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

// ==== Schema ==== //
const robotsSchema = new Schema({
  id: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  university: {
    type: String
  },
  job: {
    type: String
  },
  company: {
    type: String
  },
  skills: [{
    type: String
  }],
  phone: {
    type: Number
  },
  address: {
    street_num: {
      type: Number
    },
    street_name: {
      type: String
    },
    city: {
      type: String
    },
    state_or_province: {
      type: String
    },
    postal_code: {
      type: Number
    },
    country: {
      type: String
    }
  },
  provider: {
    type: String,
    required: true
  },
  providerId: {
    type: String
  },
  passwordHash: {
    type: String
  }
});


robotsSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};


robotsSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};


robotsSchema.statics.authenticate = function(email, password) {
  return (
    User.findOne({
      email: email
    })

    .then(user => {
      if (user && user.validatePassword(password)) {
        return user;
      } else {
        return null;
      }
    })
  );

};


const User = mongoose.model('Robot', robotsSchema);
console.log(User);
module.exports = User;
