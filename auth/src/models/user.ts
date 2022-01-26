import mongoose from 'mongoose';

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties that are User Model has
// add custom build() function with type UserAttrs and return <UserDoc>
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties that a Mongoose User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
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

// add custom function "build" to User Schema, so we can use User.build({})
// join typescript interface and moongose User together for validation
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Mongoose User model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Test TS validation
// const user = User.build({
//   email: 'asdfasd@',
//   password: 'asdfasdf',
//   asdfasdf: 'asdfasdf'
// });
// user.email = '';
// user.password = '';


export { User };
