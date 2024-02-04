import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtUser } from '../queryTypes.js';

const prisma = new PrismaClient();

class Cs2Contoller {
  updateCs2Data = async (req: Request, res: Response) => {
    // когда юзер жмякает кнопку 'обновить в профиле'
    console.log(req.body);
  };

  refillingCs2data = async (req: Request, res: Response) => {
    // дозаполнение кс данных после подключения faceit
    const user: JwtUser = req.user as JwtUser;
    const { reqMaps, reqRoles } = req.body;

    const cs2data = await prisma.cs2_data.findFirst({
      where: { userId: user.id },
      include: { roles: true, maps: true },
    });

    if (cs2data) {
      if (cs2data.roles.length === 0) {
        await prisma.cs2_dataCs2Roles.createMany({
          data: reqRoles.map((id: number) => ({
            cs2RoleId: id,
            cs2_dataId: cs2data.id,
          })),
        });
      }
      if (cs2data.maps.length === 0) {
        await prisma.cs2_dataCs2Maps.createMany({
          data: reqMaps.map((id: number) => ({
            cs2MapId: id,
            cs2_dataId: cs2data.id,
          })),
        });
      }
      const responseCs2Data = await prisma.cs2_data.findFirst({
        where: { userId: user.id },
        include: {
          roles: { select: { cs2Role: { select: { name: true } } } },
          maps: { select: { cs2Map: { select: { name: true } } } },
        },
      });
      if (responseCs2Data) {
        if (responseCs2Data.roles && responseCs2Data.maps) {
          const maps = responseCs2Data.maps.map((map) => map.cs2Map.name);
          const roles = responseCs2Data.roles.map((role) => role.cs2Role.name);
          return res.status(200).json({ ...responseCs2Data, roles, maps });
        }
      }
    }
  };
}

export default new Cs2Contoller();
