import UserService from '../services/userService';
import { UserModel } from '../models/User.model';
import { UserGroupModel } from '../models/UserGroup.model';
import { GroupModel } from '../models/Group.model';
import UserGroupService from '../services/userGroupService';
import GroupService from '../services/groupService';

let users: any[] = [];

const groupService = new GroupService(GroupModel, UserGroupModel);
const usersService = new UserService(UserModel, UserGroupModel);
const userGroupService = new UserGroupService(UserGroupModel, UserModel, GroupModel);

describe('User controller test', () => {        
    it('get users list', async () => {
      const res = await usersService.getUsers();
      users = res.map((elem: { dataValues: any }) => elem.dataValues);
      expect(users.length).toBeGreaterThan(0);
    });

    it('get list of auto suggested users', async () => {
      const res = await usersService.getAutoSuggestUsers(10, 'in');
      const suggested = users.filter(user => user.login.includes('in')).slice(0, 9);
      const resUsers = res.map((elem: { dataValues: any }) => elem.dataValues);
      expect(resUsers).toEqual(suggested);
    });

    it('get existing user with id 4', async () => {  
      const user = await usersService.get(4);
      const foundUser = users.find(usr => usr.id === 4);
      expect(user.dataValues).toEqual(foundUser);
    });

    it('get not existing user with id 10', async () => {
      const user = await usersService.get(10);
      expect(user).toBeNull();
    });

    it('delete user with id 3', async () => {
      const user = await usersService.deleteUser(3);
      const foundUser = users.find(usr => usr.id === 3);
      expect(user.dataValues).toEqual({ ...foundUser, isDeleted: true });
    });

    it('update user with id 2', async () => {
      const updatedData = {
        id: '2',
        login: "grumpycat97",
        password: "newawesomepassword12121",
        age: 24,
        isDeleted: false
      };
      const res = await usersService.update(updatedData)
      expect(res.dataValues).toEqual({ ...updatedData, id: 2});
    });

    it('update not existing user with id 21', async () => {
      const updatedData = {
        id: '21',
        login: "grumpycat97",
        password: "newawesomepassword12121",
        age: 24,
        isDeleted: false
      };
      try {
        await expect(usersService.update(updatedData)).rejects.toMatch('error')
      } catch (error: any) {
        expect(error.message).toMatch('error');
      }
    });

    it('delete not existing user with id 15', async () => {
      try {
        await usersService.deleteUser(15);
      } catch (error: any) {
        expect(error.message).toMatch('error');
      }
    });

    it('create new user', async () => {
      const user = {
        id: '',
        login: 'newlogin123',
        password: 'newpass123',
        age: 25,
        isDeleted: false
      };
      const res = await usersService.create(user);
      expect(res.dataValues).toEqual({
        ...user, id: users.length + 1, isDeleted: false
      });
    });

    it('add users 1 and 2 to group 1', async () => {
      await groupService.create({
        id: '',
        name: "group1",
        permissions: ["WRITE", "READ", "SHARE"]
      });
      const res = await userGroupService.addUsersToGroup('1', ['1','2']);
      expect(res).toEqual('Users successfully added to the group 1');
    });
});
