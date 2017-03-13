'use strict';

/**
 * User database models
 */
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        fName: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1,25],
            },
        },
        lName: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1,25],
            },
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true,
                len: [1, 255],
            },
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        verificationToken: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            validate: {
                notEmpty: true,
            },
        },
        verificationExpires: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(Date.now() + (1000 * 60 * 60 * 24)),
            validate: {
                notEmpty: true,
            },
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true,
            },
        },
        isSuspended: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    // Convert emails to lowercase
    User.afterValidate(function(user) {
        const emailLower = user.email.toLowerCase();
        user.email = emailLower;
    });

    // Hash and salt passwords before creating and updating
    User.beforeCreate(updatePassword);
    User.beforeUpdate(updatePassword);
    
    function updatePassword(user) {
        if (user.changed('password')) {
            return bcrypt.genSalt(12, function(err, salt) {
                if (err) {
                    return sequelize.Promise.reject(err);
                }
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return sequelize.Promise.reject(err);
                    }
                    user.password = hash;
                    return sequelize.Promise.resolve(user);
                });
            });
        } 
    }

    return User;
}



