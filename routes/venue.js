'use strict';

/**
 * Venue CRUD endpoints
 */
const router = require('express').Router();
const db = require('../models/index');
// const config = require('../config/config.js');
const auth = require('../middleware/authenticate');
const Promise = require('bluebird');

/* Create new venue */
router.post('/venue/create', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    db.venue
        .create({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            capacity: req.body.capacity,
            addressLineOne: req.body.addressLineOne,
            addressLineTwo: req.body.addressLineTwo,
            addressCity: req.body.addressCity,
            addressStateAbbr: req.body.addressStateAbbr,
            addressZip: req.body.addressZip,
        }).then((result) => {
            res
                .status(200)
                .json({
                    message: "Venue created successfully",
                    data: result,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(new Error("Could not create new venue"));
        });
});

/* Load existing venue */
router.get('/venue/:id/load', 
        (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Venue ID required for search"));
    }
    db.venue
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Venue not found"));
            }
            res
                .status(200)
                .json({
                    message: "Venue found",
                    data: result,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
    });
});


/* Update existing venue */
router.post('/venue/:id/update', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Venue ID required for update"));
    }
    db.venue
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Venue not found"));
            }
            if (typeof req.body.name !== 'undefined' 
                    && req.body.name !== null) {
                result.name = req.body.name;
            }
            if (typeof req.body.description !== 'undefined' 
                    && req.body.description !== null) {
                result.description = req.body.description;
            }
            if (typeof req.body.image !== 'undefined' 
                    && req.body.image !== null) {
                result.image = req.body.image;
            }
            if (typeof req.body.capacity !== 'undefined' 
                    && req.body.capacity !== null) {
                result.capacity = req.body.capacity;
            }
            if (typeof req.body.addressLineOne !== 'undefined' 
                    && req.body.addressLineOne !== null) {
                result.addressLineOne = req.body.addressLineOne;
            }
            if (typeof req.body.addressLineTwo !== 'undefined' 
                    && req.body.addressLineTwo !== null) {
                result.addressLineTwo = req.body.addressLineTwo;
            }
            if (typeof req.body.addressCity !== 'undefined' 
                    && req.body.addressCity !== null) {
                result.addressCity = req.body.addressCity;
            }
            if (typeof req.body.addressStateAbbr !== 'undefined' 
                    && req.body.addressStateAbbr !== null) {
                result.addressStateAbbr = req.body.addressStateAbbr;
            }
            if (typeof req.body.addressZip !== 'undefined' 
                    && req.body.addressZip !== null) {
                result.addressZip = req.body.addressZip;
            }
            return result.save();
        }).then((savedVenue) => {
            res
                .status(200)
                .json({
                    message: "Venue updated successfully",
                    data: savedVenue,
                    success: true
                });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

/* Delete existing venue */
router.post('/venue/:id/delete', auth.checkAuth, auth.isAdmin, 
        (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
        return next(new Error("Venue ID required"));
    }
    db.venue
        .findOne({ where: {id: req.params.id} })
        .then((result) => {
            if (!result) {
                return Promise.reject(new Error("Venue not found"));
            }
            return result.destroy()
        }).then(() => {
            res.status(200).json({
                message: "Venue deleted",
                data: {},
                success: true
            });
        }).catch((err) => {
            console.log(err);
            return next(err);
        });
});

module.exports = router;
