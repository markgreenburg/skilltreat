'use strict';

/** 
 * Table of hosting venues and businesses
 */

module.exports = function(sequelize, DataTypes) {
    const Venue = sequelize.define('venue', {
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
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        addressLineOne: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        addressLineTwo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        addressCity: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        addressStateAbbr: {
            type: DataTypes.STRING(2),
            allowNull: false,
            validate: {
                notEmpty: true,
                isUppercase: true
            },
        },
        addressZip: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Venue;
}