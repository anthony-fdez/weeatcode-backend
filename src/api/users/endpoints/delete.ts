/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router, Response } from 'express';
import User from '../../../models/User';
import Token from '../../../models/Token';
import { Auth, IUserRequest } from '../../../middleware/Auth';

const router: Router = express.Router();

const deleteUser = router.post('/delete', Auth, async (req: IUserRequest, res: Response): Promise<void> => {
  /**
   * we first search the user id, if not found json the error
   * if it is found we destroy the token and user
   */
  try {
    const deletedUser = await User.destroy({ where: { id: req.user?.userId } });
    if (!deletedUser) res.status(400).json({ error: 'Could not delete user' });
    await Token.destroy({ where: { userId: req.user?.userId } });
    res.json({ msg: 'User deleted successfully' });
  } catch (e) {
    res.status(500).json({ e });
  }
});

export default deleteUser;
