import { Router } from 'express';

import Cs2Controller from '../controllers/Cs2Controller.js';

const Cs2Router = Router();

Cs2Router.patch('/refillCs2', Cs2Controller.refillingCs2data);

export default Cs2Router;
