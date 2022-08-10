import { Schema, Model, model, Document } from 'mongoose';
import { Password } from '../services/password'

// Create an interface representing a document in MongoDB.
interface IUser {
  email: string;
  password: string;
}

// An interface that describes the properties
// a User model has
interface UserModel extends Model<UserDoc> {
  build(newUser: IUser): UserDoc;
}

// An interface that describes the properties
// that a user document has
interface UserDoc extends Document {
  email: string,
  password: string,
}

// Create a Schema corresponding to the document interface.
const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true },
  password: { type: String, required: true },
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password
      delete ret.__v

      if (!ret.id) {
        ret.id = ret._id
      }

      delete ret._id
    }
  }
});

// mongoose pre-save middleware
userSchema.pre('save', async function(){
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'))
    await this.set('password', hashedPassword)
  }
})

// extend mongoose schema (userSchema) - add a static method
// Create a new user
userSchema.statics.build = (newUser: IUser) => {
  return new User(newUser)
}

// Create a Model.
const User = model<UserDoc, UserModel>('User', userSchema);

export { User }