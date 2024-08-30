import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-46ef7","appId":"1:751838528217:web:7abce2a4fcb654b7d3b4c8","storageBucket":"danotes-46ef7.appspot.com","apiKey":"AIzaSyATcn3FBMlJnBemWAwS58iDXiFvCS__xe8","authDomain":"danotes-46ef7.firebaseapp.com","messagingSenderId":"751838528217"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
