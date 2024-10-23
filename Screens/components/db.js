import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'savedData.db' });

// Initialize the database and create tables if not exist
export const init = () => {
    return new Promise((resolve, reject) => {
        
        db.transaction((tx) => {
            // Create savedPost table
            //tx.executeSql('DROP TABLE IF EXISTS savedPost', []); //uncomment this if needed - sometimes it is good to empty the table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS savedPost (savedPost TEXT NOT NULL, category TEXT NOT NULL, username TEXT NOT NULL);',
                [],
                () => {
                    console.log('savedPost table created or already exists');
                    resolve()
                },
                (_, err) => reject(err)
            );

            // Create user table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS user (username TEXT NOT NULL, password TEXT, rememberMe BOOLEAN);',
                [],
                () => resolve(),
                (_, err) => reject(err)
            );
        });
    });
};

// Save post to the database
export const savePost = (savedPost, category, username) => {
    console.log('Types:', {
        savedPostType: typeof savedPost,
        categoryType: typeof category,
        usernameType: typeof username
    });
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Delete existing saved posts
            tx.executeSql(
                'DELETE FROM savedPost', 
                [],
                (tx, result) => {
                    console.log('Existing saved posts deleted:', result);
                    // Insert new post
                    tx.executeSql(
                        'INSERT INTO savedPost (savedPost, category, username) VALUES (?, ?, ?);',
                        [savedPost, category, username],
                        (tx, result) => {
                            console.log('Post inserted successfully:', result);
                            resolve(); // Resolve promise
                        },
                        (tx, err) => {
                            console.error('Error during INSERT execution:', err);
                            reject(err); // Reject promise
                        }
                    );
                },
                (tx, err) => {
                    console.error('Error during DELETE execution:', err);
                    reject(err); // Reject promise
                }
            );
        });
    });
};


// Add user to the database
export const addUser = (username, password, rememberMe) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM user', 
                [],
                () => {
                    console.log('Existing user data deleted');
                    tx.executeSql(
                        'INSERT INTO user (username, password, rememberMe) VALUES (?, ?, ?);', 
                        [username, password, rememberMe ? 1 : 0],
                        () => resolve(),
                        (_, err) => reject(err)
                    );
                },
                (_, err) => reject(err)
            );
        });
    });
};

// Update fish data (adjusted for your context)
export const updateFish = (id, breed, weight) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE fishTable SET breed = ?, weight = ? WHERE id = ?;',
                [breed, weight, id],
                () => resolve(),
                (_, err) => reject(err)
            );
        });
    });
};

// Delete fish from the table
export const deleteFish = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM fishTable WHERE id = ?;',
                [id],
                () => resolve(),
                (_, err) => reject(err)
            );
        });
    });
};

// Fetch saved posts for a specific user
export const fetchSavedPost = (username) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM savedPost WHERE username = ?;',
                [username],
                (tx, result) => {
                    const rows = result.rows;
                    if (rows.length > 0) {
                        let savedPosts = [];
                        for (let i = 0; i < rows.length; i++) {
                            savedPosts.push(rows.item(i)); // Extract each row
                        }
                        resolve(savedPosts); // Resolving the array of posts
                    } else {
                        resolve([]); // No posts found
                    }
                },
                (tx, err) => {
                    console.error('Error fetching saved posts:', err);
                    reject(err);
                }
            );
        });
    });
};

// Fetch all users from the database
export const FetchUser = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user', 
                [], 
                (tx, result) => {
                    const rows = result.rows;
                    if (rows.length > 0) {
                        let users = [];
                        for (let i = 0; i < rows.length; i++) {
                            users.push(rows.item(i)); // Extract each row
                        }
                        resolve(users); // Resolve the array of users
                    } else {
                        resolve([]); // No users found
                    }
                }, 
                (tx, err) => {
                    console.error('Error fetching user data:', err);
                    reject(err);
                }
            );
        });
    });
};
