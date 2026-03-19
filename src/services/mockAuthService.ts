// Mock authentication service for development
interface SignupUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  role: string;
}

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  password?: string; // Store password hash (in real app, this would be properly hashed)
}

export class MockAuthService {
  private mockUsers: MockUser[] = [];

  // Initialize mock users from localStorage or start with empty array
  constructor() {
    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
      this.mockUsers = JSON.parse(storedUsers);
    }
  }

  async signIn(email: string, password: string): Promise<MockUser> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in registered users
    const user = this.mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }
    
    // Validate password (in real app, you'd compare with stored hash)
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(user));
    return user;
  }

  async signUp(userData: SignupUserData): Promise<MockUser> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: MockUser = {
      uid: `user-${Date.now()}`,
      email: userData.email,
      displayName: `${userData.firstName} ${userData.lastName}`,
      emailVerified: true,
      firstName: userData.firstName,
      lastName: userData.lastName,
      organization: userData.organization,
      role: userData.role,
      password: userData.password // In real app, this would be a hashed password
    };
    
    // Store in mock users array and localStorage
    this.mockUsers.push(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers));
    
    return newUser;
  }

  async signOut(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('mockUser');
  }

  async getCurrentUser(): Promise<MockUser | null> {
    // Check if user is "logged in" (in real app, this would check Firebase auth state)
    const storedUser = localStorage.getItem('mockUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    // Mock listener - in real app this would be Firebase's onAuthStateChanged
    const user = this.getCurrentUser();
    user.then(callback);
    return () => {}; // Return unsubscribe function
  }

  // Helper method to clear all mock data (for testing purposes)
  clearAllUsers(): void {
    this.mockUsers = [];
    localStorage.removeItem('mockUsers');
    localStorage.removeItem('mockUser');
  }
}

export const mockAuthService = new MockAuthService();
