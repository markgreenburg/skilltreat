'use strict';
/**
 * Role definitions for users
 */
module.exports = function(sequelize, DataTypes) {
    const Role = sequelize.define('role', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Role;
}