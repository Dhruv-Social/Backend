import argon2 from "argon2";

const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

const verifyPassword = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (err) {
    return false;
  }
};

export { hashPassword, verifyPassword };
