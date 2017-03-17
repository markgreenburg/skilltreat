'use strict';

/**
 * CRUD routes for orders
 */
const router = require('express').Router();
const db = require('../models/index');
const auth = require('../middleware/authenticate');
const Promise = require('bluebird');

/* Read all orders for given user */
router.route('/order')
    .all(auth.checkAuth)
    .get((req, res, next) => {
        db.order
            .findAll({ where: {userId: req.jwtPayload.id} })
            .then((orders) => {
                if (!orders) {
                    return Promise.reject(new Error("User has no orders"));
                }
                res
                    .status(200)
                    .json({
                        message: "Orders found",
                        data: orders,
                        success: true
                    });
            }).catch((err) => {
                console.log(err);
                return next(err);
            });
    })
    .post((req, res, next) => {
        // 1. Get Stripe API token from purchase
        const stripeId = req.body.stripeId;
        if (typeof stripeId === 'undefined' || stripeId === null) {
            return next(new Error("stripeId is required to create order"));
        }
        const cartItems = [];
        // 2. Get all active cart items for user
        db.cart
            .findAll({
                where: {
                    userId: req.jwtPayload.id,
                },
                includes: [{
                    model: db.elective,
                    where: {
                        startTime: {
                            gte: new Date()
                        },
                    },
                }],
            }).then((results) => {
                cartItems = results;
                // 2. Total up the quant. x elective price for each cart item
                const total = results.reduce((accum, result) => {
                    return accum + (result.quantity * result.price), 0
                });
                // 3. Then write to the orders table with the total, stripe ID
                return db.order.create({ stripeId: stripeId, total: total });
            }).then((order) => {
            // 6. Take all the cart items and save them to elect_orders table
                
            })
        // 7. Send response
        const stripeId = req.body.stripeId;
        const total = req.body.total;
        if (
            (typeof stripeId === 'undefined' || stripeId === null)
            || (typeof total === 'undefined' || total === null)
        ) {
            return next(new Error("stripeId and total amount required"));
        }
        db.order
            .create({
                stripeId: stripeId,
                total: total,

            })
    })

/* Read one particular order for given user */
router.get('/order/:id', auth.checkAuth, (req, res, next) => {
    db.order
        .findOne({ where: {userId: req.jwtPayload.id, id: req.params.id} })
        .then((order) => {
            if (!order) {
                return Promise.reject(new Error("Order not found"));
            }
            res
                .status(200)
                .jason({
                    message: "Order found",
                    data: order,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Create new order */
router.post('/order')
