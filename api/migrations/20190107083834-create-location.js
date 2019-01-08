module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Locations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
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
      type: Sequelize.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
        as: 'subLocationId',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Locations'),
};
