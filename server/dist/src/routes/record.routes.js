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
const recordController = __importStar(require("../controllers/record.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const record_validator_1 = require("../validators/record.validator");
const router = (0, express_1.Router)();
// All record routes require authentication
router.use(auth_middleware_1.authenticate);
/**
 * GET /api/records
 * Get paginated records with optional filters.
 * All authenticated roles can access (scoped by role in service).
 */
router.get('/', (0, validate_middleware_1.validate)(record_validator_1.recordQuerySchema, 'query'), recordController.getAll);
/**
 * GET /api/records/categories
 * Get distinct categories for filter dropdowns.
 * Must be defined BEFORE /:id to avoid route conflict.
 */
router.get('/categories', recordController.getCategories);
/**
 * GET /api/records/export
 * Export all matching records as a downloadable CSV file.
 * Must be defined BEFORE /:id to avoid route conflict.
 */
router.get('/export', recordController.exportCSV);
/**
 * GET /api/records/:id
 * Get a single record by ID.
 * All authenticated roles can access (ownership check in service).
 */
router.get('/:id', recordController.getById);
/**
 * POST /api/records
 * Create a new financial record.
 * ADMIN and ANALYST only (VIEWER cannot create).
 */
router.post('/', (0, rbac_middleware_1.authorizeRoles)('ADMIN', 'ANALYST'), (0, validate_middleware_1.validate)(record_validator_1.createRecordSchema), recordController.create);
/**
 * PUT /api/records/:id
 * Update an existing financial record.
 * ADMIN and ANALYST only (ANALYST has ownership check in service).
 */
router.put('/:id', (0, rbac_middleware_1.authorizeRoles)('ADMIN', 'ANALYST'), (0, validate_middleware_1.validate)(record_validator_1.updateRecordSchema), recordController.update);
/**
 * DELETE /api/records/:id
 * Delete a financial record.
 * ADMIN only.
 */
router.delete('/:id', (0, rbac_middleware_1.authorizeRoles)('ADMIN'), recordController.remove);
exports.default = router;
//# sourceMappingURL=record.routes.js.map