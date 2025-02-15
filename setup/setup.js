/*
    This script is used to perform a first time setup of the DB and anything
    else that may need to be configured. This should not be ran as part of the
    regular application and should be executed manually or through a script.

    If it doesn't exist, the database will be created. All of the tables used 
    in the application will be deleted, then re-created.
*/

const setupQueries = require('./setupQueries.js');

console.log('Setup started.');

async function setup() {
    try {
        console.log('Creating database.');
        await setupQueries.createDatabase();
    } catch (error) {
        console.error('Error creating database: ', error);
        return false;
    }

    try {
        console.log('Deleting all tables.');
        await setupQueries.deleteAllTables();
    } catch (error) {
        console.error('Error deleting tables: ', error);
        return false;
    }

    try {
        console.log('Creating all tables.');
        await setupQueries.createAllTables();
    } catch (error) {
        console.error('Error setting up tables: ', error);
        return false
    }

    return true;
}

setup()
.then((success) => {
    console.log(success ? 'Setup finished successfully.' : 'Setup failed');
    setupQueries.endPool();
});