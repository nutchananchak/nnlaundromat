import express from 'express';
import { 
  login, 
  register, 
  forgotPassword, 
  getProfile, 
  updateProfile 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/profile/:phone', getProfile);
router.put('/profile/:phone', updateProfile);

export default router;