import express, { Request, Response } from 'express';
import { IUser } from '../interfaces/IUser';
import UserMiddleware from '../middleware/user.middleware';
import { UserModel } from '../models/User.model';
import { UserGroupModel } from '../models/UserGroup.model';
import UserService from '../services/userService';
import UserGroupService from '../services/userGroupService';
import { GroupModel } from '../models/Group.model';

const router = express.Router();
const usersService = new UserService(UserModel, UserGroupModel);
const userMiddleware = new UserMiddleware();
const userGroupServive = new UserGroupService(UserGroupModel, UserModel, GroupModel);

router.post('/user', userMiddleware.userValidation, async (req: Request, res: Response) => {
    try {
        const user = await usersService.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({
            errorMessage: 'User with a such login has already exists'
        });
    }
});

router.put('/user/:id', userMiddleware.userValidation, async (req: Request, res: Response) => {
    try {
        const userDTO: IUser = {
            id: req.params.id,
            ...req.body
        };
        const user = await usersService.update(userDTO);
        res.json(user);
    } catch (err) {
        res.status(404).json({
            errorMessage: `User with id ${req.params.id} doesn't exist`
        });
    }
});

router.get('/user/:id', async (req: Request, res: Response) => {
    const user = await usersService.get(+req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    }
});

router.delete('/user/:id', async (req: Request, res: Response) => {
    try {
        const user = await usersService.deleteUser(+req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({
            errorMessage: `'Error while trying to delete a user with id: ${req.params.id}`,
            error
        });
    }
});

router.get('/getAutoSuggestUsers', userMiddleware.userSuggest, async (req: Request, res: Response) => {
    try {
        const limit: string = req.query.limit as string;
        const login: string = req.query.login as string;

        const users = await usersService.getAutoSuggestUsers(+limit, login);
        res.json({ suggestedUsers: users });
    } catch (error) {
        res.status(500).json({
            errorMessage: 'Error while trying to receive data',
            error
        });
    }
});

router.post('/user/addUsersToGroup', userMiddleware.userGroupValidation, async (req: Request, res: Response) => {
    try {
        const groupId = req.body.groupId as string;
        const userIds = req.body.userIds as string[];
        const result = await userGroupServive.addUsersToGroup(groupId, userIds);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error });
    }
});

router.get('/', async (req: Request, res: Response) => {
    const users = await usersService.getUsers();
    res.json({ users });
});

export default router;
