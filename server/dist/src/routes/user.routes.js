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
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
// All admin routes require authentication + ADMIN role
router.use(auth_middleware_1.authenticate);
router.use((0, rbac_middleware_1.authorizeRoles)('ADMIN'));
/**
 * GET /api/admin/users
 * Get all users.
 */
router.get('/', userController.getAllUsers);
/**
 * POST /api/admin/users
 * Create a new user.
 */
router.post('/', (0, validate_middleware_1.validate)(user_validator_1.createUserSchema), userController.createUser);
/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
router.get('/:id', userController.getUserById);
/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role.
 */
router.patch('/:id/role', (0, validate_middleware_1.validate)(user_validator_1.changeRoleSchema), userController.changeRole);
/**
 * PATCH /api/admin/users/:id/status
 * Toggle a user's active/inactive status.
 */
router.patch('/:id/status', (0, validate_middleware_1.validate)(user_validator_1.toggleStatusSchema), userController.toggleStatus);
exports.default = router;
//# sourceMappingURL=user.routes.js.map