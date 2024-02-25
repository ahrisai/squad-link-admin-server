import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { secretKey } from '../config.js';
const prisma = new PrismaClient();
const saltRounds = 7;
class PlayerController {
  updatePlayerById = async (req: Request, res: Response) => {
    try {
      if (typeof req.query.id === 'string') {
        const Uid = parseInt(req.query.id);
        console.log(req.body);
        await prisma.user.update({ where: { id: Uid }, data: req.body });
        console.log('дошел');
        const users = await prisma.user.findMany({ include: { cs2_data: true }, orderBy: { id: 'asc' } });
        return res.status(200).json(users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchAllPlayers = async (req: Request, res: Response) => {
    try {
      const players = await prisma.user.findMany({ include: { cs2_data: true }, orderBy: { id: 'asc' } });
      return res.status(200).json(players);
    } catch (error) {}
  };

  deletePlayerById = async (req: Request, res: Response) => {
    const id = typeof req.query.id === 'string' ? parseInt(req.query.id) : undefined;

    if (id !== undefined) {
      await prisma.user.delete({ where: { id: id } });
    }

    const players = await prisma.user.findMany({ include: { cs2_data: true } });
    res.status(200).json(players);
  };

  fetchPlayerByName = async (req: Request, res: Response) => {
    try {
      const name = req.query.name as string;

      const player = await prisma.user.findFirst({
        where: { nickname: name },
        include: {
          cs2_data: {
            include: {
              roles: { select: { cs2Role: { select: { name: true } } } },
              maps: { select: { cs2Map: { select: { name: true } } } },
            },
          },
        },
      });

      if (!player) {
        return res.status(404).json('user is not exist');
      } else {
        return res.status(200).json({ ...player, password: undefined });
      }
    } catch (error) {
      return res.status(500).json('eternal server error =<');
    }
  };
  createPlayer = async (req: Request, res: Response) => {
    try {
      const { nickname, password } = req.body;
      console.log(req.body);
      const candidate = await prisma.user.findFirst({
        where: { nickname: nickname },
      });
      if (candidate) {
        return res.status(400).json({ message: `user ${nickname} already exist` });
      }
      const hash = bcrypt.hashSync(password, saltRounds);

      const user = {
        ...req.body,
      };
      console.log('user');

      await prisma.user.create({
        data: { ...user, password: hash },
      });
      const players = await prisma.user.findMany({
        orderBy: { id: 'asc' },
      });
      console.log('аж сюда');
      res.status(200).json(players);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'reg error, try again' });
    }
  };
}

export default new PlayerController();
