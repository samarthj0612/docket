import SQLite from 'react-native-sqlite-storage';

// database connection
const db = SQLite.openDatabase(
  {
    name: 'docket',
    location: 'default',
  },
  result => {
    console.info(Date(Date.now()), ' - Database successfully connected!');
  }, //on success
  error => console.error('Database error', error), //on error
);

export default db;
