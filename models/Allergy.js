const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Allergy extends Model {}

Allergy.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        allergen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reaction: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        severity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'allergy',
    }
); 

module.exports = Allergy;