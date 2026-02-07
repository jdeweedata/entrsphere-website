
import { databases, DATABASE_ID, BETA_SIGNUPS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export interface BetaSignup {
  name: string;
  email: string;
  company?: string;
  challenge: string;
  otherChallenge?: string;
  consent: boolean;
}

export const createBetaSignup = async (signupData: BetaSignup) => {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      BETA_SIGNUPS_COLLECTION_ID,
      ID.unique(),
      {
        name: signupData.name,
        email: signupData.email,
        company: signupData.company || '',
        challenge: signupData.challenge,
        other_challenge: signupData.otherChallenge || '',
        consent: signupData.consent,
        created_at: new Date().toISOString()
      }
    );
    
    return { success: true, data: document };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const checkDuplicateEmail = async (email: string) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      BETA_SIGNUPS_COLLECTION_ID,
      [`email="${email}"`]
    );
    
    return result.documents.length > 0;
  } catch {
    return false;
  }
};
