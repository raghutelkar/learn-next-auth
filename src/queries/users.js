import { User } from "@/model/user-model";

export async function createUser(user) {
  try {
    await User.create(user);
  } catch (e) {
    throw new Error(e);
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (e) {
    throw new Error(e);
  }
}