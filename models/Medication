const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Medication extends Model {}

Medication.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        dosage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: 'Prescription',
            validate: {
                isIn: [['Prescription', 'Over-the-Counter', 'Supplement/Vitamin']],
            },
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
        modelName: 'medication',
    }
);  

module.exports = Medication;