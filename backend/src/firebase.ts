import * as admin from 'firebase-admin';
import * as path from 'path';

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Production (Render): load from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as admin.ServiceAccount;
} else {
  // Local development: load from file
  serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://rickshaw-matching-system-default-rtdb.firebaseio.com'
  });
}

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
