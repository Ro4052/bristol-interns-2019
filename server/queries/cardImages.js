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
        },
        etag: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        labels: {
            type: DataTypes.JSONB,
            notEmpty: true
        }
    });
 
    CardImages.associate = models => {
        CardImages.hasMany(models.cardImages);
    };

    return CardImages;
}
