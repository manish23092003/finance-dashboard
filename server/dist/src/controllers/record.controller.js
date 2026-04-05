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
exports.getAll = getAll;
exports.getCategories = getCategories;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.exportCSV = exportCSV;
const recordService = __importStar(require("../services/record.service"));
const csv_util_1 = require("../utils/csv.util");
/**
 * Record Controller — thin HTTP adapter for record service.
 * Extracts authenticated user context from req.user and query/body data,
 * then delegates to the service layer.
 */
/**
 * GET /api/records
 * Get paginated records with optional filters.
 */
async function getAll(req, res, next) {
    try {
        const result = await recordService.getAll(req.query, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * GET /api/records/categories
 * Get distinct categories for filter dropdowns.
 */
async function getCategories(req, res, next) {
    try {
        const categories = await recordService.getCategories(req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * GET /api/records/:id
 * Get a single record by ID.
 */
async function getById(req, res, next) {
    try {
        const record = await recordService.getById(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * POST /api/records
 * Create a new financial record.
 */
async function create(req, res, next) {
    try {
        const record = await recordService.create(req.body, req.user.id);
        res.status(201).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * PUT /api/records/:id
 * Update an existing financial record.
 */
async function update(req, res, next) {
    try {
        const record = await recordService.update(req.params.id, req.body, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * DELETE /api/records/:id
 * Delete a financial record (admin only, enforced by RBAC middleware).
 */
async function remove(req, res, next) {
    try {
        const result = await recordService.remove(req.params.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * GET /api/records/export
 * Export all matching records as a CSV file.
 * Respects RBAC (ADMIN gets all, others get own) and query filters.
 */
async function exportCSV(req, res, next) {
    try {
        const records = await recordService.getExportData(req.query, req.user.id, req.user.role);
        const csv = (0, csv_util_1.toCSV)(records, [
            { header: 'Date', accessor: (r) => new Date(r.date).toISOString().split('T')[0] },
            { header: 'Category', accessor: (r) => r.category },
            { header: 'Type', accessor: (r) => r.type },
            { header: 'Amount', accessor: (r) => r.amount.toFixed(2) },
            { header: 'Notes', accessor: (r) => r.notes },
            { header: 'User', accessor: (r) => r.user.name },
            { header: 'Email', accessor: (r) => r.user.email },
        ]);
        const timestamp = new Date().toISOString().split('T')[0];
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="transactions_${timestamp}.csv"`);
        res.status(200).send(csv);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=record.controller.js.map