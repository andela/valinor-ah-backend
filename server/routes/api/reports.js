import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ReportValidation from '../../middlewares/ReportValidation';
import ReportController from '../../controllers/ReportController';

const reports = express.Router();

const {
  validateReport
} = ReportValidation;

const {
  addReport,
  getAllReports
} = ReportController;

// route to get report
// TODO make this route accessible to only admin
reports.get('/reports', verifyToken, getAllReports);

// route to add/update report types
// TODO make this route accessible to only admin
reports.post('/report-types', verifyToken, validateReport, addReport);

export default reports;
