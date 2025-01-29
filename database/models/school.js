'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class School extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          
        }

        
    }

    School.init({
      name: DataTypes.STRING,
      address: DataTypes.TEXT,
      contact_email: DataTypes.STRING,
      contact_phone: DataTypes.STRING,
      deletedAt:DataTypes.DATE,
    }, {
        sequelize,
        paranoid: true,
        modelName: 'School',
    });

    //School.sync({alter:true})

    return School;
};