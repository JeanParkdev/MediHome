const User = require('./User');
const Medication = require('./Medication');
const Doctor = require('./Doctor');
const Allergy = require('./Allergy');


//Relationships
User.hasMany(Medication, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
User.hasMany(Doctor, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
User.hasMany(Allergy, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

//Belongs to User
Medication.belongsTo(User, {
    foreignKey: 'user_id',
});
Doctor.belongsTo(User, {
    foreignKey: 'user_id',
});
Allergy.belongsTo(User, {
    foreignKey: 'user_id',
});
module.exports = { User, Medication, Doctor, Allergy };