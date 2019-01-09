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
    male: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    female: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    subLocationId: {
      type: DataTypes.INTEGER,
      onDelete: 'SET NULL',
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
  });

  Location.associate = (models) => {
    Location.belongsTo(models.Location, {
      as: 'subLocation',
    });
  };

  return Location;
};
