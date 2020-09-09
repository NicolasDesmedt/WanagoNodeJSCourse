import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
  country: String,
});

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
    address: addressSchema,
    twoFactorAuthenticationCode: String,
    creditCardNumber: {
      type: String,
      get: (creditCardNumber: string) => {
        return `****-****-****-${creditCardNumber.substr(creditCardNumber.length - 4)}`;
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
