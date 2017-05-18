/**
 * Seed data for dev database
 */
// Create roles
module.exports = {
  up: function (queryInterface) {
    return [
      queryInterface.bulkInsert('roles', [
        { type: 'user', createdAt: new Date(), updatedAt: new Date() },
        { type: 'admin', createdAt: new Date(), updatedAt: new Date() },
        { type: 'teacher', createdAt: new Date(), updatedAt: new Date() },
      ])];
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('roles', [
      { type: 'user' },
      { type: 'admin' },
      { type: 'teacher' },
    ]);
  },
};
