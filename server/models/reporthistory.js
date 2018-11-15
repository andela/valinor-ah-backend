export default (sequelize, DataTypes) => {
  const ReportHistory = sequelize.define('ReportHistory', {
    reportBody: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    reporterId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER
  }, {});

  ReportHistory.associate = (models) => {
    const { ReportType, User } = models;

    ReportHistory.belongsTo(ReportType, {
      as: 'category'
    });

    ReportHistory.belongsTo(User, {
      as: 'author'
    });

    ReportHistory.belongsTo(User, {
      as: 'reporter'
    });
  };

  return ReportHistory;
};
