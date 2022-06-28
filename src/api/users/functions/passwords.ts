import bcrypt from "bcrypt";

interface HashPasswordInterface {
  textPassword: string;
}

interface CompareHashPasswordInterface {
  textPassword: string;
  hash: string;
}

export const hashPasswordAsync = async ({
  textPassword,
}: HashPasswordInterface) => {
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(textPassword, saltRounds);

  return hashedPassword;
};

export const compareHashedPasswordAsync = async ({
  textPassword,
  hash,
}: CompareHashPasswordInterface) => {
  const isMatch = await bcrypt.compare(textPassword, hash);

  return isMatch;
};
