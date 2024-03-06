import { Router } from 'express';

import PlayerController from '../controllers/PlayerController.js';

const playerRouter = Router();

playerRouter.get('/playerByName', PlayerController.fetchPlayerByName);
playerRouter.get('/fetchAllPlayers', PlayerController.fetchAllPlayers);
playerRouter.delete('/deletePlayerById', PlayerController.deletePlayerById);
playerRouter.patch('/updatePlayerById', PlayerController.updatePlayerById);
playerRouter.post('/createPlayer', PlayerController.createPlayer);
playerRouter.get('/totalPages', PlayerController.totalPages);

export default playerRouter;
