import { prisma } from "../prisma";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const createUser = ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
};
