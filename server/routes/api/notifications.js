import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import NotificationController from '../../controllers/NotificationController';

const notifications = express.Router();

const { getUserNotifications } = NotificationController;

// get notifications for a user
notifications.get('/notifications', verifyToken, getUserNotifications);

export default notifications;
