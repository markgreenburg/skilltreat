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
        lat: req.body.lat,
        lng: req.body.lng,
      }).then((result) => {
        res
          .status(200)
          .json({
            message: 'Venue created successfully',
            data: result,
            success: true,
          });
      }).catch(() => next(new Error('Could not create new venue')));
  });

/* Load existing venue */
router.get('/venue/:id/load',
  (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
      return next(new Error('Venue ID required for search'));
    }
    return db.venue
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (!result) {
          return Promise.reject(new Error('Venue not found'));
        }
        return res
          .status(200)
          .json({
            message: 'Venue found',
            data: result,
            success: true,
          });
      }).catch(err => next(err));
  });


/* Update existing venue */
router.post('/venue/:id/update', auth.checkAuth, auth.isAdmin,
  (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
      return next(new Error('Venue ID required for update'));
    }
    return db.venue
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (!result) {
          return Promise.reject(new Error('Venue not found'));
        }
        const venueProperties = [
          'name', 'description', 'image', 'capacity', 'addressLineOne',
          'addressLineTwo', 'addressCity', 'addressStateAbbr', 'addressZip',
        ];
        venueProperties.forEach((property) => {
          if (typeof req.body[property] !== 'undefined'
            && req.body[property] !== null) {
            result[property] = req.body[property];
          }
        });
        return result.save();
      }).then((savedVenue) => {
        res
          .status(200)
          .json({
            message: 'Venue updated successfully',
            data: savedVenue,
            success: true,
          });
      }).catch(err => next(err));
  });

/* Delete existing venue */
router.post('/venue/:id/delete', auth.checkAuth, auth.isAdmin,
  (req, res, next) => {
    if (typeof req.params.id === 'undefined' || req.params.id === null) {
      return next(new Error('Venue ID required'));
    }
    return db.venue
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (!result) {
          return Promise.reject(new Error('Venue not found'));
        }
        return result.destroy();
      }).then(() => {
        res.status(200).json({
          message: 'Venue deleted',
          data: {},
          success: true,
        });
      }).catch(err => next(err));
  });

module.exports = router;
