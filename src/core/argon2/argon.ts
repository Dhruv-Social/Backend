import argon2 from "argon2";

/**
 * Function To Hash a password
 * @param password: string,
 * @returns Promise<string> hashed password
 */
const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

/**
 * Function to verify if a password is correct
 * @param hashedPassword: string, hashed password
 * @param password: string, normal password
 * @returns Promise<boolean> if the password is correct
 */
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
