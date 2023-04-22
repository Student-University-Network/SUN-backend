import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';

initializeApp({
	credential: cert('firebase-adminsdk-key.json'),
});

export function getMessaging() {
	return admin.messaging();
}
