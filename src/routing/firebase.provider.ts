// src/firebase/firebase.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Optional, aber empfohlen
import { initializeApp, App, cert, ServiceAccount, applicationDefault } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

// Eindeutiges Symbol für die Injektion
export const FIREBASE_MESSAGING = 'FIREBASE_MESSAGING';

// Firebase Provider
export const FirebaseProvider: Provider = {
  provide: FIREBASE_MESSAGING,
  // Optional: Injizieren Sie den ConfigService, um Credentials sauber zu laden
  inject: [ConfigService], 
  useFactory: (configService: ConfigService) => {
    // Sicherstellen, dass die App nicht bereits initialisiert wurde
    let app: App;
    try {
      app = initializeApp({
        // Verwenden Sie applicationDefault() oder laden Sie die Credentials explizit
        // Dies ist der empfohlene Weg, um den Pfad aus Umgebungsvariablen zu laden
        credential: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
          ? cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON))
          : applicationDefault(),
      });
    } catch (error) {
      if (error.code === 'app/duplicate-app') {
        // Ignorieren Sie den Fehler, wenn die App bereits existiert
        console.warn('Firebase app [DEFAULT] already exists. This is normal in a hot-reload environment.');
        // Importiere getApp dynamisch, um zirkuläre Abhängigkeiten zu vermeiden
        const { getApp } = require('firebase-admin/app');
        app = getApp();
      } else {
        throw error;
      }
    }
    
    return getMessaging(app);
  },
};