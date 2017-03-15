'use strict';

/**
 * Elective Routes - mounted at /api
 */
const router = require('express').Router();
const db = require('../models/index');
const config = require('../config/config.js');
const auth = require('../middleware/authenticate');
// TO-DO: Auth all the relevant routes

// TO-DO: Write owner user ID to the electives_users mapping table??
/* Create a new elective */
router.post('/elective/create', auth.checkAuth, (req, res, next) => {
    db.elective.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        totalSpaces: req.body.totalSpaces,
        price: req.body.price
    }).then((result) => {
        res.status(200).json({
            message: "Class created successfully",
            data: result,
            success: true
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("Could not create new elective"));
    });
});

/* Read */
// TO-DO: Include related table results to pull attendee, owner emails
router.get('/elective/:id/load', (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required for search"));
    }
    db.elective.findOne({ where: {id: req.params.id} }).then((result) => {
        if (!result) return next(new Error("Elective not found"));
        res.status(200).json({
            message: "Elective found",
            data: result,
            success: true
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: Could not search for elective"));
    });
});

/* Update */
// TO-DO: Allow for updating the class's owner
router.post('/elective/:id/update', auth.checkAuth, (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required for update"));
    }
    db.elective.findOne({ where: {id: req.params.id} }).then((result) => {
        if (!result) return next(new Error("Elective not found"));
        if (typeof req.body.name !== 'undefined' && req.body.name !== null) {
            result.name = req.body.name;
        }
        if (typeof req.body.description !== 'undefined' 
                && req.body.description !== null) {
            result.description = req.body.description;
        }
        if (typeof req.body.image !== 'undefined' && req.body.image !== null) {
            result.image = req.body.image;
        }
        if (typeof req.body.date !== 'undefined' && req.body.date !== null) {
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
        if (typeof req.body.price !== 'undefined' && req.body.price !== null) {
            result.price = req.body.price;
        }
        result.save().then(() => {
            res.status(200).json({
                message: "Elective updated successfully",
                data: result,
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error("DB Error: could not save update"));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: Could not search for elective"));
    });
});

/* Delete */
// TO-DO: Cascade delete to relevant linking tables
router.post('/elective/:id/delete', auth.checkAuth, (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Elective ID required"));
    }
    db.findOne({ where: {id: req.params.id} }).then((result) => {
        if (!result) return next(new Error("Elective not found"));
        result.destroy().then(() => {
            res.status(200).json({
                message: "Elective deleted",
                data: {},
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(new Error("DB Error: Could not destroy record"));
        });
    }).catch((err) => {
        console.log(err);
        return next(new Error("DB Error: Could not search for elective"));
    });
});

module.exports = router;