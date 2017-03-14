'use strict';
/**
 * Seed data for dev database
 */
// Create roles
module.exports = {
    up: function(queryInterface, Sequelize) {
        return [
            queryInterface.bulkInsert('users', [
                { 
                    fName: "Mark",
                    lName: "Greenburg",
                    email: "mark@markgreenburg.com",
                    password: "", // Should get encrypted?
                    verificationToken: "9cee0ae4-fc9e-4ed8-b410-6e369bb05dd1",
                    verificationExpires: "2017-03-15 11:13:27.577-05",
                    isVerified: true,
                    isSuspended: false,
                    createdAt: "2017-03-14 11:13:34.857-05",
                    updatedAt: "2017-03-14 11:13:55.857-05"
                }
            ])];
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', [
            { id: 1 }
        ])}
}