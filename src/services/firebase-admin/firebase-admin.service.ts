import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private firebaseApp!: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const serviceAccountPath = this.configService.get<string>(
      'SERVICE_ACCOUNT_KEY_PATH',
    );

    if (!serviceAccountPath) {
      this.logger.error(
        'Firebase Admin Service Account Path (SERVICE_ACCOUNT_KEY_PATH) is not configured.',
      );
      // Potentially throw an error here or handle appropriately if Firebase is critical
      return;
    }

    // Check if an app is already initialized to prevent re-initialization errors.
    // This can happen in environments with hot-reloading or multiple initializations.
    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin SDK initialized successfully.');
    } else {
      // Use the already initialized default app
      this.firebaseApp = admin.app();
      this.logger.log('Firebase Admin SDK was already initialized.');
    }
  }

  getMessaging(): admin.messaging.Messaging {
    if (!this.firebaseApp) {
      this.logger.error(
        'Firebase Admin SDK not initialized. Call onModuleInit first or ensure it was successful.',
      );
      throw new Error('Firebase Admin SDK not initialized.');
    }
    return this.firebaseApp.messaging();
  }

  // Add other Firebase Admin services as needed (e.g., auth, firestore)
  // getAuth(): admin.auth.Auth {
  //   if (!this.firebaseApp) throw new Error('Firebase Admin SDK not initialized.');
  //   return this.firebaseApp.auth();
  // }
}
