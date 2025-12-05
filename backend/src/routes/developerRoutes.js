import express from 'express';
import {
  createDeveloper,
  getDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper
} from '../controllers/developerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createDeveloperSchema,
  updateDeveloperSchema,
  listDeveloperQuerySchema
} from '../validators/developerValidators.js';

const developerRoutes = express.Router();

// List with query validation
developerRoutes.get(
  '/',
  protect,
  validateRequest(listDeveloperQuerySchema),
  getDevelopers
);

// Create
developerRoutes.post(
  '/',
  protect,
  validateRequest(createDeveloperSchema),
  createDeveloper
);

// Get by id (no body/query validation needed here)
developerRoutes.get('/:id', protect, getDeveloperById);

// Update
developerRoutes.put(
  '/:id',
  protect,
  validateRequest(updateDeveloperSchema),
  updateDeveloper
);

// Delete
developerRoutes.delete('/:id', protect, deleteDeveloper);

export default developerRoutes;
