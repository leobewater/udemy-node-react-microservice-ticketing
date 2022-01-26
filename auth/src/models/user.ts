import mongoose from 'mongoose';
import { Password } from '../services/password';

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
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      reuired: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // mapping and hide mongoose returned fields
    toJSON: {
      transform(doc, ret) {
        // remap "_id" to "id"
        ret.id = ret._id;
        // hide "_id", "password" and "__v" from showing in API response
        delete ret._id;
        delete ret.password; 
        delete ret.__v;
      }
    },
  }
);

// mongoose middleware function before saving, can't use arrow function
userSchema.pre('save', async function (done) {
  // check if password is modified, skip re-saving the already hashed password
  // new record is considered modified
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// add custom function "build" to User Schema, so we can use User.build({})
// join typescript interface and moongose User together for validation
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Mongoose User model
// the <> is the generic function and passing argument to the function model
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
