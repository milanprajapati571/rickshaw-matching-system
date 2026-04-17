import * as admin from 'firebase-admin';


const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rickshaw-matching-system-default-rtdb.firebaseio.com'
});

export const db = admin.database();

export const mockDb = {
  stops: [
    { id: '1', name: 'Library' },
    { id: '2', name: 'Boys Hostel' },
    { id: '3', name: 'Girls Hostel' },
    { id: '4', name: 'Canteen' },
    { id: '5', name: 'Main Building' }
  ]
};
