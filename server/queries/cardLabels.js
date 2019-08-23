module.exports = function(sequelize, DataTypes) {
    const CardLabels = sequelize.define('cardLabels', {
        cardId: {
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        labels: {
            type: DataTypes.JSONB,
            notEmpty: true
        }
    });
 
    CardLabels.associate = models => {
        CardLabels.hasMany(models.cardLabels);
    };

    return CardLabels;
}
