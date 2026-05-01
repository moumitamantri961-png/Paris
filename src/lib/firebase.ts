/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCL4uKc0Jku_r9KVSvG_2ShPSiR0xt0TFQ",
  authDomain: "appp-76120.firebaseapp.com",
  databaseURL: "https://appp-76120-default-rtdb.firebaseio.com",
  projectId: "appp-76120",
  storageBucket: "appp-76120.firebasestorage.app",
  messagingSenderId: "165877305206",
  appId: "1:165877305206:web:9af4bce75b9d52f3f13457"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
