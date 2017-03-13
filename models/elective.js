'use strict';

/**
 * Class / Elective database models
 */

module.exports = function(sequelize, DataTypes) {
    const Elective = sequelize.define('elective', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
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
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        // To-Do: Add one-to-one teacher to class relation
        date: {},
        startTime: {},
        endTime: {},
        totalSpaces: {},
        reservedSpaces: {},
        price: {},
        // To-Do: Separate location table?
        location: {},
    });

    return Elective;
}