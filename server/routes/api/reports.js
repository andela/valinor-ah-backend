import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ReportValidation from '../../middlewares/ReportValidation';
import ReportController from '../../controllers/ReportController';
import validateAccess from '../../middlewares/validateAccess';

const reports = express.Router();

const {
  validateReport
} = ReportValidation;

const {
  addReport,
  getAllReports
} = ReportController;

// route to get report
reports.get('/reports', verifyToken, validateAccess(['ADMIN']), getAllReports);

// route to add/update report types
reports.post(
  '/report-types',
  verifyToken,
  validateAccess(['ADMIN']),
  validateReport, addReport
);

export default reports;
