// Functions for hadling the local database ( SQL lite)

import { openDatabase } from 'react-native-sqlite-storage';
// Sql lite installation:
// npm uninstall -g react-native-cli @react-native-community/cli
// npm install react-native-sqlite-storage

var db = openDatabase({ name: 'savedData.db' });

// Initialize the database and create tables if not exist
export const init = () => {
    return new Promise((resolve, reject) => {
        
        db.transaction((tx) => {
            //tx.executeSql('DROP TABLE IF EXISTS user', []); //use this to clear tables if needed 
            //tx.executeSql('DROP TABLE IF EXISTS savedPost', []); //use this to clear tables if needed 
            // Create savedPost table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS savedPost (id INTEGER PRIMARY KEY AUTOINCREMENT, savedPost TEXT NOT NULL, category TEXT NOT NULL, username TEXT NOT NULL);',
                [],
                () => {
                    console.log('savedPost table created or already exists');
                    resolve()
                },
                (_, err) => reject(err)
            );

            // Create user table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT, token TEXT NOT NULL, rememberMe BOOLEAN);',
                [],
                () => resolve(),
                (_, err) => reject(err)
            );
        });
    });
};

// Functions for user table

// Fetch user from the database
export const FetchUser = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user;', 
                [],
                (tx, result) => {
                    const users = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        users.push(result.rows.item(i)); // Push each user to the array
                    }
                    resolve(users); // Resolve with the array of users
                },
                (tx, err) => {
                    console.error('Error fetching user data:', err);
                    reject(err); // Reject with an error
                }
            );
        });
    });
};


// Add user to the database
export const addUser = (username, password, token, rememberMe) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM user', //delete all rows from user to ensure we have only one user logged in
                [],
                () => {
                    console.log('Existing user data deleted');
                    tx.executeSql(
                        'INSERT INTO user (username, password, token, rememberMe) VALUES (?, ?, ?, ?);', 
                        [username, password, token, rememberMe ? 1 : 0],
                        () => {
                            resolve();
                        },
                        (_, err) => reject(err)
                        
                    );
                },
                (_, err) => reject(err)
            );
        });
    });
};

// Delete user from the database
export const deleteUser = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM user', 
                [],
                () => {
                    console.log('User data deleted');
                    resolve();
                },
                (_, err) => {
                    console.error('Error deleting user:', err);
                    reject(err);
                }
            );
        });
    });
};


// Fetch the saved posts for the given username
export const fetchSavedPost = (username) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM savedPost WHERE username = ?;', 
                [username],
                (tx, result) => {
                    const savedPosts = []; // Initialize an array to hold saved posts
                    for (let i = 0; i < result.rows.length; i++) {
                        savedPosts.push(result.rows.item(i)); // Push each saved post to the array
                    }
                    resolve(savedPosts); // Resolve with the array of saved posts
                },
                (tx, err) => {
                    console.error('Error fetching saved posts:', err);
                    reject(err); // Reject with an error
                }
            );
        });
    });
};


// Save post to the database
export const savePost = (savedPost, category, username) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Use REPLACE to either insert a new row or replace the existing one
            tx.executeSql(
                'REPLACE INTO savedPost (id, savedPost, category, username) VALUES (?, ?, ?, ?);',
                [1, savedPost, category, username], 
                (tx, result) => {
                    console.log('Post inserted or replaced successfully:', result);
                    resolve(result); // Resolve promise with result
                },
                (tx, err) => {
                    console.error('Error during REPLACE execution:', err.message || err);
                    reject(err); // Reject promise with error
                }
            );
        });
    });
};

