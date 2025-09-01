import { Router } from "express";
import { 
  homePage,
  signup,
  signin,
  searchusers,
  sendmessage, 
  getUsersWithLatestMessages, 
  getConversation
} from '../controller/controllers.js';

const router = Router();

// Test route
router.get("/", homePage);

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);

// User routes
router.get('/search/:username', searchusers);
router.get('/latest/:username', getUsersWithLatestMessages);

// Message routes
router.post('/sendmessage/:from/:to', sendmessage);
router.get('/getconversation/:from/:to', getConversation);

export default router;


