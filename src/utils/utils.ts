import { User } from '../models/User';

export function sorting(a: User, b: User): number {
    const secondCondition = (b.login > a.login) ? -1 : 0;
    return (a.login > b.login) ? 1 : secondCondition;
}
