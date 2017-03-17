'use strict';

/**
 * model for user shopping carts
 */

module.exports = function(sequelize, DataTypes) {
    const Cart = sequelize.define('cart', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
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

    return Cart;
}