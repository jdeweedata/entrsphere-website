
import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://appwrite.entrsphere.com/v1') // Your Appwrite endpoint
  .setProject('68338876000f8d6f7dbe');               // Your Project ID

export const account = new Account(client);
export const databases = new Databases(client);

// Database and collection IDs - these should match your Appwrite setup
export const DATABASE_ID = 'entrsphere_db';
export const BETA_SIGNUPS_COLLECTION_ID = 'beta_signups';

export default client;
