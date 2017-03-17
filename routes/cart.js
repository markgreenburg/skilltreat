'use strict';

/**
 * CRUD routes for user shopping cart
 */
const router = require('express').Router();
const db = require('./models/index');
const auth = require('./middleware/authenticate');
const Promise = require('bluebird');

/* Read all non-expired cart entries for given user */
router.get('/cart', auth.checkAuth, (req, res, next) => {
    db.cart
        .findAll({ 
            where: {
                userId: req.jwtPayload.id,
            },
            include: [{
                model: db.elective,
                where: {
                    startTime: {
                        gte: new Date(),
                    },
                },
            }],
        }).then((results) => {
            if (!results) {
                return Promise.reject(new Error("No items in cart"));
            }
            res
                .status(200)
                .json({
                    message: "Cart found",
                    data: results,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Create new cart record / add items to cart. Only allows future electives */
router.post('/cart/add', auth.checkAuth, (req, res, next) => {
    const electiveId = req.body.electiveId;
    const quantity = req.body.quantity;
    if (
        (typeof electiveId === 'undefined' || electiveId === null)
        || (typeof quantity === 'undefined' || quantity === null)
    ) {
        return next(new Error('Must provide user, elective, and quantity'));
    }
    db.elective
        .findOne({
            where: {
                id: electiveId,
                startTime: {
                    gte: new Date(),
                },
            },
        }).then((elective) => {
            if (!elective) {
                return Promise.reject(new Error(`Elective not found or already
                        started`));
            }
            return db.cart.create({
                    userId: req.jwtPayload.id,
                    electiveId: electiveId,
                    quantity: quantity,
            });
        }).then((cart) => {
            res
                .status(200)
                .json({
                    message: "Elective added to user cart successfully",
                    data: cart,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Update existing cart record */
router.post('/cart/update', auth.checkAuth, (req, res, next) => {
    const quantity = req.body.quantity;
    const cartId = req.body.cartId;
    if (
        (typeof quantity === 'undefined' || quantity === null)
        || (typeof cartId === 'undefined' || cartId === null)
    ) {
        return next(new Error("Elective and new quantity required"));
    }
    let foundCart = {};
    db.cart
        .findOne({ 
            where: { 
                id: cartId,
                userId: req.jwtPayload.id, 
            },
        }).then((cart) => {
            if (!cart) {
                return Promise.reject(new Error("Item not found in cart"));
            }
            foundCart = cart;
            return db.elective.findOne({ where: {id: cart.electiveId} });
        }).then((elective) => {
            if (!elective) {
                return Promise.reject(new Error("Elective not found"));
            }
            const spaceLeft = elective.totalSpaces - elective.reservedSpaces;
            if (quantity >= spaceLeft) {
                return Promise.reject(new Error("Exceeds open spaces"));
            }
            foundCart.quantity = quantity;
            return foundCart.save();
        }).then((updatedCart) => {
            res
                .status(200)
                .json({
                    message: "quantity updated successfully",
                    data: updatedCart,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Delete existing cart record */
router.post('/cart/delete', auth.checkAuth, (req, res, next) => {
    if (typeof req.body.cartId === 'undefined' || req.body.cartId === null) {
        return next(new Error("cartId required but not provided"));
    }
    db.cart
        .findOne({ where: { id: req.body.cartId, userId: req.jwtPayload.id }})
        .then((cart) => {
            if (!cart) {
                return Promise.reject(new Error("Cart record not found"));
            }
            return cart.destroy();
        }).then(() => {
            res
                .status(200)
                .json({
                    message: "Cart item deleted successfully",
                    data: {},
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});


