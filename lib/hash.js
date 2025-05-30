import bcrypt from "bcrypt";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
