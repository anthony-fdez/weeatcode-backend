import express, { Router, Request, Response } from 'express';
import { logger } from '../../../../config/logger';
import { sendToken } from '../../../middleware/Auth';
import User, { UserAttributesInterface } from '../../../models/User';

const router: Router = express.Router();

const signup = router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) throw new Error('All fields must be filled out');
    const user = await User.create({
      name,
      email,
      password,
    }) as unknown as UserAttributesInterface;
    sendToken(user, 200, res);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(404).json({
        message: 'Email already in use',
      });
    }
    logger.log({
      level: 'error',
      message: 'register failed',
    });
    console.log(err);
  }
});

export default signup;
