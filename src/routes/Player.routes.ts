import { Router } from 'express';

import PlayerController from '../controllers/PlayerController.js';

const playerRouter = Router();

playerRouter.get('/playerByName', PlayerController.fetchPlayerByName);
playerRouter.get('/fetchAllPlayers', PlayerController.fetchAllPlayers);
playerRouter.delete('/deletePlayerById', PlayerController.deletePlayerById);
playerRouter.patch('/updatePlayer', PlayerController.updatePlayerById);
playerRouter.post('/createPlayer', PlayerController.createPlayer);

export default playerRouter;
