export default (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 2,
          msg: 'Location name must be minimum of 2 characters',
        },
        notEmpty: {
          args: true,
          msg: 'Location name cannot be empty',
        },
      },
    },
    subLocationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
        as: 'subLocationId',
      },
    },
  });

  Location.associate = (models) => {
    Location.hasOne(models.Location, {
      foreignKey: 'subLocationId',
    });
  };

  return Location;
};
