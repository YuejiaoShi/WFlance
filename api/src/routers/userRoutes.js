import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUserFromToken,
  validateUser,
} from "../../controllers/userController.js";
import authenticateToken from "../../middlewares/authenticateToken.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Hello,this user router works" });
});

userRouter.get("/users", authenticateToken, getUsers);
//userRouter.get("/users",authenticateToken, getUsers);
userRouter.get("/users/:id", authenticateToken, getUserById);
//userRouter.get("/users/:id",authenticateToken, getUserById);

userRouter.post("/users", validateUser, createUser);

userRouter.get("/user", getUserFromToken);

export default userRouter;
