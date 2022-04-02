import admin from 'firebase-admin';
import app from 'firebase-admin';

import { decrypt, encrypt } from '~/utils/crypto';

import { DatabaseService, User } from './database-service.d';

class FirebaseService implements DatabaseService {
  db: admin.firestore.Firestore;
  users: User[];

  constructor() {
    this.users = [];

    const firebaseConfig = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    };

    if (!admin.apps.length) {
      app.initializeApp({
        credential: admin.credential.cert(firebaseConfig as any),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }

    this.db = admin.firestore();
  }

  async create_user(user: Omit<User, 'id'>) {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const existing_user = await this.get_user_by_username(user.username);

    if (existing_user) {
      return null;
    }

    const new_user = {
      id,
      ...user,
      oauth_token: encrypt(user.oauth_token),
    };

    this.db.collection('users').doc(id).set(new_user);

    return new_user;
  }

  async get_user_by_id(id: User['id']) {
    let user = undefined;

    await this.db
      .collection('users')
      .where('id', '==', id)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          user = doc.data();
          user.oauth_token = decrypt(user.oauth_token);
        });
      });

    return user;
  }

  async get_user_by_username(username: User['username']) {
    let user = undefined;

    await this.db
      .collection('users')
      .where('username', '==', username)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          user = doc.data();
          user.oauth_token = decrypt(user.oauth_token);
        });
      });

    return user;
  }
}

export default FirebaseService;
