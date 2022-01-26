import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// Mongoose User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    reuired: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Mongoose User model
const User = mongoose.model('User', userSchema);

// join typescript interface and moongose User together for validation
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

// to test TS validation
// buildUser({
//   eml: 'asdfasd@',
//   password: 123,
//   asdfasdf: 'asdfasdf'
// })

export { User, buildUser };
