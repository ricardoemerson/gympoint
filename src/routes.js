import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

// Routes without authentication.
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Routes with authentication.
// Users Resource.
routes.put('/users', UserController.update);

// Students Resource.
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
