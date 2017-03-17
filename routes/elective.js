'use strict';

/**
 * Elective Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
// const config = require('../config/config.js');
const auth = require('../middleware/authenticate');
const Promise = require('bluebird');

// TO-DO: Write owner user ID to the electives_users mapping table??
// TO-DO: Better error descriptions when fields missing
/* Create a new elective */
router.post('/elective/create', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    db.elective
        .create({
            name: req.body.name,
            instructor: req.body.instructor,
            description: req.body.description,
            image: req.body.image,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            totalSpaces: req.body.totalSpaces,
            price: req.body.price,
            venueId: req.body.venueId,
        }).then((result) => {
            res
                .status(200)
                .json({
                    message: "Class created successfully",
                    data: result,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(new Error("Could not create new elective"));
        });
});

/* Read all future electives */

/* Read Single Elective */
// TO-DO: Include related table results to pull attendee, owner emails
router.get('/elective/:id/load', (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required for search"));
    }
    db.elective
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Elective not found"));
            }
            res
                .status(200)
                .json({
                    message: "Elective found",
                    data: result,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
    });
});

/* Update */
router.post('/elective/:id/update', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required for update"));
    }
    db.elective
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Elective not found"));
            }
            if (typeof req.body.name !== 'undefined' 
                    && req.body.name !== null) {
                result.name = req.body.name;
            }
            if (typeof req.body.instructor !== 'undefined' 
                    && req.body.instructor !== null) {
                result.instructor = req.body.instructor;
            }
            if (typeof req.body.description !== 'undefined' 
                    && req.body.description !== null) {
                result.description = req.body.description;
            }
            if (typeof req.body.image !== 'undefined' 
                    && req.body.image !== null) {
                result.image = req.body.image;
            }
            if (typeof req.body.date !== 'undefined' 
                    && req.body.date !== null) {
                result.date = req.body.date;
            }
            if (typeof req.body.startTime !== 'undefined' 
                    && req.body.startTime !== null) {
                result.startTime = req.body.startTime;
            }
            if (typeof req.body.endTime !== 'undefined' 
                    && req.body.endTime !== null) {
                result.endTime = req.body.endTime;
            }
            if (typeof req.body.totalSpaces !== 'undefined' 
                    && req.body.totalSpaces !== null) {
                result.totalSpaces = req.body.totalSpaces;
            }
            if (typeof req.body.price !== 'undefined' 
                    && req.body.price !== null) {
                result.price = req.body.price;
            }
            return result.save();
        }).then((savedElective) => {
            res
                .status(200)
                .json({
                    message: "Elective updated successfully",
                    data: savedElective,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Delete */
// TO-DO: Cascade delete to relevant linking tables
router.post('/elective/:id/delete', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required"));
    }
    db.elective
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Elective not found"));
            }
            return result.destroy()
        }).then(() => {
            res.status(200).json({
                message: "Elective deleted",
                data: {},
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Add user to elective */
router.post('/elective/:id/add_user', auth.checkAuth, auth.isSelf, 
        (req, res, next) => {
    const eId = req.params.id;
    const uId = req.body.id;
    if ((typeof eId === 'undefined' || eId === null)
            || typeof uId === 'undefined' || uId === null) {
        return next(new Error("Elective ID and user ID required"));
    }
    db.elective
        .findOne({ where: {id: eId}})
        .then((elective) => {
            if (!elective) {
                return Promise.reject(new Error("Elective Not Found"));
            }
            const remainingSpaces = elective.totalSpaces - elective.reservedSpaces;
            if (!remainingSpaces) {
                return Promise.reject(new Error("Elective is full"));
            }
            const now = new Date();
            if (elective.startTime < now) {
                return Promise.reject(new Error("Elective already started"));
            }
            return elective.setUsers([uId])
        }).then(() => {
            res
                .status(200)
                .json({
                    message: "User added to elective",
                    data: {
                        electiveId: eId,
                        userId: uId,
                    },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Remove user from elective */
router.post('/elective/:id/remove_user', auth.checkAuth, auth.isSelf, 
        (req, res, next) => {
    const eId = req.params.id;
    const uId = req.body.id;
    if ((typeof eId === 'undefined' || eId === null)
            || typeof uId === 'undefined' || uId === null) {
        return next(new Error("Elective ID and user ID required"));
    }
    db.elective
        .findOne({
            where: { id: eId },
            include: [{
                model: db.user,
                where: { id: uId }
            }]
        }).then((elective) => {
            if (!elective) {
                return Promise.reject(new Error(
                        "Elective and user combination not found"
                ));
            }
            return elective.removeUser([uId]);
        }).then(() => {
            res
                .status(200)
                .json({
                    message: "User removed from elective",
                    data: {
                        electiveId: eId,
                        userId: uId,
                    },
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

module.exports = router;