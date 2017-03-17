'use strict';

/**
 * Custom linking model for electives_orders table
 */

module.exports = function(sequelize, DataTypes) {
    const ElectiveOrder = sequelize.define('electives_orders', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true,
                min: 1,
            },
        },
    });

    return ElectiveOrder;
}