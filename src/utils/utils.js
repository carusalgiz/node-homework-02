"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sorting = void 0;
function sorting(a, b) {
    const secondCondition = (b.login > a.login) ? -1 : 0;
    return (a.login > b.login) ? 1 : secondCondition;
}
exports.sorting = sorting;
