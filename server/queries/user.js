module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        score: {
            type: DataTypes.INTEGER
        },
        password: DataTypes.STRING,
    });
 
    User.associate = models => {
        User.hasMany(models.user);
    };

    return User;
}
