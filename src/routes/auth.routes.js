import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/auth.controller.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validator.js';

const router = Router();

// 5 requests per 15 minutes per IP, counted separately for every route that uses its own limiter();
// the 429 carries a Retry-After header (express-rate-limit sets it when the limit is hit)
const limiter = (limit = env.AUTH_RATE_LIMIT_MAX) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(429, 'Too many attempts, try again later', 'RATE_LIMITED')),
  });

router.post('/register', limiter(), validate(registerSchema), controller.register);
router.post('/login', limiter(), validate(loginSchema), controller.login);
// clients refresh about once per access-token lifetime, so this limit is more generous
router.post('/refresh', limiter(Math.max(30, env.AUTH_RATE_LIMIT_MAX)), validate(refreshSchema), controller.refresh);

router.get('/me', authenticate, controller.me);
router.post('/logout', authenticate, controller.logout);
router.post('/logout-all', authenticate, controller.logoutAll);

router.post('/change-password', authenticate, limiter(), validate(changePasswordSchema), controller.changePassword);
router.post('/forgot-password', limiter(), validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', limiter(), validate(resetPasswordSchema), controller.resetPassword);

router.post('/verify-email', limiter(), validate(verifyEmailSchema), controller.verifyEmail);
router.post('/resend-verification', authenticate, limiter(), controller.resendVerification);

export default router;
