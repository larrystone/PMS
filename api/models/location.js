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
    total: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    subLocationId: {
      type: DataTypes.INTEGER,
      onDelete: 'SET NULL',
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: (location) => {
        location.total = Number.parseInt(location.male, 10) + Number.parseInt(location.female, 10); //eslint-disable-line
      },
      beforeUpdate: (location) => {
        location.total = Number.parseInt(location.male, 10) + Number.parseInt(location.female, 10); //eslint-disable-line
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
