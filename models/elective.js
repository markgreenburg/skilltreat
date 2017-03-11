'use strict';

/**
 * Class / Elective database models
 */

module.exports = function(sequelize, DataTypes) {
    const Elective = sequelize.define('elective', {
        total: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    }, {
        // TO-DO: fix association exec order
        classMethods: {
            associate: function(models) {
                Elective.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false,
                    },
                });
            }
        }
    });

    return Elective;
}