const get = (key: string): string => (import.meta.env[key] as string | undefined) ?? ''

export const env = {
  API_BASE_URL: get('VITE_API_BASE_URL') || 'https://dev.codeleap.co.uk/careers/',
  FIREBASE_API_KEY: get('VITE_FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: get('VITE_FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: get('VITE_FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: get('VITE_FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: get('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: get('VITE_FIREBASE_APP_ID'),
}
