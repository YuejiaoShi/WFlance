import User from "../models/user.js";
import bcrypt from "bcrypt";
import Role from "../models/role.js";
import jwt from "jsonwebtoken";

const createUserService = async (name, email, password, phone, roleName) => {
  const createdAt = new Date();
  try {
    const role = await Role.findOne({ where: { roleName: roleName } });
    if (!role) {
      throw new Error(`Role "${roleName}" not found`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      createdAt,
      roleId: role.id,
    });
    return user;
  } catch (err) {
    console.error(`Error in createUserService: ${err.message}`);
    throw new Error("Error creating user: " + err.message);
  }
};
const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.sub) {
      throw new Error("Invalid token format");
    }
    const { sub: userId } = decoded;
    //console.log("Decoded token: " + JSON.stringify(decoded));

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("user: " + JSON.stringify(user));
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleName,
    };
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

const findUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is required to find a user");
    }

    const user = await User.findOne({ where: { email } });

    return user;
  } catch (err) {
    console.error(`Error in findUserByEmail: ${err.message}`);
    throw new Error(`Error finding user by email: ${err.message}`);
  }
};

export default {
  createUserService,
  getAllUsers,
  getUserById,
  getUserFromToken,
  findUserByEmail,
};
