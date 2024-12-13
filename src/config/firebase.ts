export interface FirebaseConfig {
  readonly credential: FirebaseCredentialConfig;
}

export interface FirebaseCredentialConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}
