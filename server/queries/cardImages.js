module.exports = function(sequelize, DataTypes) {
    const CardImages = sequelize.define('cardImages', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        url: {
            type: DataTypes.STRING,
            notEmpty: true
        }
    });
 
    CardImages.associate = models => {
        CardImages.hasMany(models.cardImages);
    };

    return CardImages;
}
