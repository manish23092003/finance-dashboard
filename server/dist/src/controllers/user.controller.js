"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.changeRole = changeRole;
exports.toggleStatus = toggleStatus;
const userService = __importStar(require("../services/user.service"));
/**
 * User Controller — admin-only user management.
 * All routes using this controller should have ADMIN RBAC middleware applied.
 */
/**
 * POST /api/admin/users
 * Create a new user.
 */
async function createUser(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * GET /api/admin/users
 * Get all users.
 */
async function getAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role.
 */
async function changeRole(req, res, next) {
    try {
        const user = await userService.changeRole(req.params.id, req.body.role, req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * PATCH /api/admin/users/:id/status
 * Toggle a user's active status.
 */
async function toggleStatus(req, res, next) {
    try {
        const user = await userService.toggleStatus(req.params.id, req.body.isActive, req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.controller.js.map