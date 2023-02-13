import express, { NextFunction, Request, Response } from 'express';
import { IGroup } from '../interfaces/IGroup';
import GroupMiddleware from '../middleware/group.middleware';
import LoggerMiddleware from '../middleware/logger.middleware';
import { GroupModel } from '../models/Group.model';
import { UserGroupModel } from '../models/UserGroup.model';
import GroupService from '../services/groupService';

const router = express.Router();
const groupService = new GroupService(GroupModel, UserGroupModel);
const groupMiddleware = new GroupMiddleware();

router.post('/group', groupMiddleware.groupValidation, async (req: Request, res: Response) => {
    try {
        const group = await groupService.create(req.body);
        res.json(group);
    } catch (error) {
        LoggerMiddleware.logRequestData(req);
        res.status(400).json({
            errorMessage: 'Group with the same name already exists'
        });
    }
});

router.put('/group/:id', groupMiddleware.groupValidation, async (req: Request, res: Response) => {
    try {
        const groupDTO: IGroup = {
            id: req.params.id,
            ...req.body
        };
        const group = await groupService.update(groupDTO);
        res.json(group);
    } catch (error) {
        LoggerMiddleware.logRequestData(req);
        res.status(404).json({
            errorMessage: `Group with id ${req.params.id} doesn't exist`
        });
    }
});

router.get('/group/:id', async (req: Request, res: Response) => {
    const group = await groupService.get(+req.params.id);
    if (group) {
        res.json(group);
    } else {
        LoggerMiddleware.logRequestData(req);
        res.status(404).json({
            errorMessage: `Unable to find a group with id: ${req.params.id}`
        });
    }
});

router.delete('/group/:id', async (req: Request, res: Response) => {
    try {
        const group = await groupService.deleteGroup(+req.params.id);
        res.json(group);
    } catch (error) {
        LoggerMiddleware.logRequestData(req);
        res.status(404).json({ error });
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await groupService.getGroups();
        res.json({ groups });
    } catch (error) {
        next(error);
        return;
    }
});

export default router;
