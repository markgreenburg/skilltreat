'use strict';

/**
 * CRUD routes for orders
 */
const router = require('express').Router();
const db = require('../models/index');
const auth = require('../middleware/authenticate');
const Promise = require('bluebird');

router
    .route('/order')
    .all(auth.checkAuth)
    /* Read all orders for given user */
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
    /* Post a new order */
    .post((req, res, next) => {
        // 1. Get Stripe API token from purchase and charged total
        const stripeId = req.body.stripeId;
        const total = req.body.total;
        if (
            (typeof stripeId === 'undefined' || stripeId === null)
            || (typeof total === 'undefined' || total === null)
        ) {
            return next(new Error(`stripeId and total required to create 
                    order`));
        }
        let newOrder = {};
        let foundCartItems = [];
        db.order
            // 2. Create a new order with the paid amount and stripe info
            .create({ 
                stripeId: stripeId, 
                total: total, 
                userId: req.jwtPayload.id
            // 3. Get user's active cart items
            }).then((order) => {
                newOrder = order;
                return db.cart.findAll({ 
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
                });
            // 4. Copy cart items over to electives_orders table
            }).then((cartItems) => {
                if (!cartItems.len === 0) {
                    return Promise.reject(new Error("No items found in cart"));
                }
                foundCartItems = cartItems;
                const electivesOrdersArray = cartItems.map((item) => {
                    return {
                        electiveId: item.electiveId,
                        quantity: item.quantity,
                        orderId: newOrder.id
                    }
                });
                return db.electives_orders.bulkCreate(electivesOrdersArray);
            // 5. Delete the ordered items from the user's cart
            }).then(() => {
                const cartIdArray = foundCartItems.map((item) => {
                    return item.id;
                });
                return db.cart.destroy({ where: {id: cartIdArray} });
            // 6. Send response
            }).then(() => {
                res
                    .status(200)
                    .json({
                        message: "Order created successfully",
                        data: newOrder,
                        success: true
                    });
            }).catch((err) => {
                console.log(err);
                return next(err);
            });
    });

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

module.exports = router;
