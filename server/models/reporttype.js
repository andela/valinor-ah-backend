export default (sequelize, DataTypes) => {
  const ReportType = sequelize.define('ReportType', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});

  ReportType.associate = (models) => {
    const { ReportHistory } = models;

    ReportType.hasMany(ReportHistory,
      { as: 'type', foreignKey: 'typeId' });
  };

  return ReportType;
};
