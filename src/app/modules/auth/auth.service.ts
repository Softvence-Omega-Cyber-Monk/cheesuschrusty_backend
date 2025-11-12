import { AppError } from "../../utils/app_error";
import { TLoginPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import { User_Model } from "../user/user.model";
import mongoose from "mongoose";
import { jwtHelpers } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../../utils/mail_sender";

// login user
const login_user_from_db = async (payload: TLoginPayload) => {
  // console.log("payload:", payload);
  // check account info
  const isExistAccount = await User_Model.findOne({ email: payload.email });
  console.log("isExistAccount:", isExistAccount);
  if (!isExistAccount) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isExistAccount.password
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      role: isExistAccount.role,
      userId: isExistAccount._id,
    },
    configs.jwt.access_token_secret as Secret,
    configs.jwt.access_expires as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: isExistAccount.email,
      role: isExistAccount.role,
      userId: isExistAccount._id,
    },
    configs.jwt.refresh_token_secret as Secret,
    configs.jwt.refresh_expires as string
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    role: isExistAccount.role,
    userId: isExistAccount._id,
  };
};

const refresh_token_from_db = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  // console.log("decodedData:", decodedData);

  const userData = await User_Model.findOne({
    email: decodedData?.email,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData!.email,
      role: userData!.role,
      userId: userData!._id,
    },
    configs.jwt.access_token_secret as Secret,
    configs.jwt.access_expires as string
  );

  return { accessToken };
};

const change_password_from_db = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const isExistAccount = await User_Model.findOne({ email: user.email });
  console.log("isExistAccount:", isExistAccount);
  if (!isExistAccount) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password
  );

  if (!isCorrectPassword) {
    throw new AppError("Old password is incorrect", httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
  await User_Model.findOneAndUpdate(
    { email: isExistAccount.email },
    {
      password: hashedPassword,
      lastPasswordChange: Date(),
    }
  );
  return "Password changed successful.";
};

const forget_password_from_db = async (email: string) => {
  const isAccountExists = await User_Model.findOne({ email: email });
  if (!isAccountExists) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }
  const resetToken = jwtHelpers.generateToken(
    {
      email: isAccountExists.email,
      role: isAccountExists.role,
    },
    configs.jwt.reset_secret as Secret,
    configs.jwt.reset_expires as string
  );

  const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
  const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

  await sendMail({
    to: email,
    subject: "Password reset successful!",
    textBody: "Your password is successfully reset.",
    htmlBody: emailTemplate,
  });

  return "Check your email for reset link";
};

export const auth_services = {
  login_user_from_db,
  refresh_token_from_db,
  change_password_from_db,
  forget_password_from_db,
};
