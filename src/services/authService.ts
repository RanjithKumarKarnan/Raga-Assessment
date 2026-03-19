import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface SignupUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  role: string;
}

export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async signUp(userData: SignupUserData): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    
    // Store additional user data in Firestore
    await this.storeUserData(userData, userCredential.user.uid);
    
    return userCredential.user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Optional: Store additional user data in Firestore
  private async storeUserData(userData: SignupUserData, uid: string): Promise<void> {
    // Implementation would go here to store user data in Firestore
    // This is commented out as it requires additional Firestore setup
    console.log('Storing user data for:', userData.email, 'with UID:', uid);
    /*
    const { db } = await import('../config/firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    
    await setDoc(doc(db, 'users', uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      organization: userData.organization,
      role: userData.role,
      createdAt: new Date().toISOString()
    });
    */
  }
}

export const authService = new AuthService();
