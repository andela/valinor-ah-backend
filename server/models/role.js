export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    privilege: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  });
  Role.associate = (models) => {
    const { User } = models;
    Role.hasMany(User, { foreignKey: 'roleId' });
  };
  return Role;
};
