import models from '../models';

const {
  User, ReportHistory, ReportType
} = models;

/**
 * @class ReportController
 * @description Reporting Article related Operations
 */
class ReportController {
/**
    * @description - This method gets adds a new report.
    * @param {object} req - The request object
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf ReportController
    */
  static addReport(req, res) {
    const { title, description } = req.body;

    ReportType
      .findOrCreate({
        where: { title },
        defaults: { title, description }
      })
      .spread((newReport, created) => {
        if (created) {
          return res.status(200).json({
            status: 'success',
            message: 'report type successfully added',
            report: newReport
          });
        }

        res.status(409).json({
          status: 'failure',
          message: 'report type already exists'
        });
      })
      .catch(err => res.status(500).json({
        status: 'failure',
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
    * @description - This method gets all reports
    * @param {object} req - The request object
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf ReportController
    */
  static getAllReports(req, res) {
    ReportHistory
      .findAll({
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: ReportType,
        }],
      })
      .then((reports) => {
        res.status(200).json({
          status: 'success',
          message: 'reports retrieved successfully',
          reports
        });
      })
      .catch(err => res.status(500).json({
        status: 'failure',
        errors: {
          message: [err.message]
        }
      }));
  }
}

export default ReportController;
