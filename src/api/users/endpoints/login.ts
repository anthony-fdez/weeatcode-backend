import express, { Router, Request, Response } from "express";
import User, { UserAttributesInterface } from "../../../models/User";
import { sendToken } from "../../../middleware/Auth";

const router: Router = express.Router();

const login = router.post("/login", async (req: Request, res: Response) => {
  try {
    const newUser = new User;
    const { email, password } = req.body;
    if (!password) throw new Error("Field 'password' required");
    if (!email) throw new Error("Field 'email' is required.");
    const user = await User.findOne({
      where: {
        email: email,
      },
      attributes: ['password', 'id']
    }) as unknown as UserAttributesInterface;
    if(!user) return res.status(400).json({ message: "User not found" });
    const passwordsMatch = newUser.compareHashedPassword(password, user);
    if(!passwordsMatch) return res.status(400).json({ message: "Invalid email or password" });
    sendToken(user, 200, res);
  } catch (e) {
    res.status(500).json({ e });
    console.log(e);
  }
});

export default login;