'use strict';

/**
 * Class / Elective database models
 */

module.exports = function(sequelize, DataTypes) {
    const Elective = sequelize.define('elective', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        instructor: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                isDate: true,
            },
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: true,
            },
        },
        totalSpaces: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Elective;
}