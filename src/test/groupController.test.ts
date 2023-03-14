import { UserGroupModel } from '../models/UserGroup.model';
import { GroupModel } from '../models/Group.model';
import GroupService from '../services/groupService';
import { IGroup } from '../interfaces/IGroup';

const groupService = new GroupService(GroupModel, UserGroupModel);
let groups: any[] = [];

describe('Group controller test', () => {   
    it('create new group with several permissions', async () => {
        const group: IGroup = {
            id: '',
            name: "group",
            permissions: ['WRITE', 'READ', 'SHARE']
        };
        const res = await groupService.create(group); 
        expect(res.dataValues).toBeTruthy();
    });

    it('create new group with one permission', async () => {
        const group: IGroup = {
            id: '',
            name: "group2",
            permissions: ['WRITE']
        };
        const res = await groupService.create(group); 
        expect(res.dataValues).toBeTruthy();
    });

      
    it('get groups list', async () => {
        const res = await groupService.getGroups();
        groups = res.map((elem: { dataValues: any }) => elem.dataValues);
        expect(groups.length).toBeGreaterThan(0);
    });

    it('get existing group with id 2', async () => {  
        const group = await groupService.get(2);
        const foundGroup = groups.find(group => group.id === 2);
        expect(group.dataValues).toEqual(foundGroup);
    });

    it('update group with id 2', async () => {
        const updatedData: IGroup = {
          id: '2',
          name: "newName",
          permissions: ['WRITE', 'READ']
        };
        const res = await groupService.update(updatedData)
        expect(res.dataValues).toEqual({ ...updatedData, id: 2});
    });

    it('delete group with id 2', async () => {
        const group = await groupService.deleteGroup(2);
        expect(group).toBe('Group 2 successfully removed');
    });
});