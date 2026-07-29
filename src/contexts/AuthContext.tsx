import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { adminService } from '../services/adminService';
import { superAdminService } from '../services/superAdminService';
import type { LoginRequest, SignUpRequest, User, UserRole, DecodedToken } from '../types';
import { decodeJwt } from '../utils/jwt';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<{ role: UserRole; phoneRequired: boolean; profileRequired: boolean; pwdChangeRequired: boolean }>;
  logout: () => Promise<void>;
  signup: (data: SignUpRequest) => Promise<void>;
  verifyPhoneNumber: (phno: string) => Promise<void>;
  submitProfile: (profileData: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  decodedTokenInfo: DecodedToken | null;
  profileRequired: boolean;
  pwdChangeRequired: boolean;
  changeUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true';
  const mockRole = (import.meta.env.VITE_MOCK_ROLE as UserRole) || 'ADMIN';

  const [user, setUser] = useState<User | null>(
    isMockAuth ? { user_id: 'mock-id-123', name: 'Dev User', email: 'dev@local.host', phno: '1234567890', role: mockRole } : null
  );
  const [role, setRole] = useState<UserRole | null>(isMockAuth ? mockRole : null);
  const [accessToken, setAccessToken] = useState<string | null>(isMockAuth ? 'mock-token' : null);
  const [refreshToken, setRefreshToken] = useState<string | null>(isMockAuth ? 'mock-refresh' : null);
  const [isLoading, setIsLoading] = useState<boolean>(!isMockAuth);
  const [decodedTokenInfo, setDecodedTokenInfo] = useState<DecodedToken | null>(null);
  const [profileRequired, setProfileRequired] = useState<boolean>(false);
  const [pwdChangeRequired, setPwdChangeRequired] = useState<boolean>(false);
  
  const { showSuccess, showError, showApiError } = useToast();
  const navigate = useNavigate();

  const clearAuthState = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setAccessToken(null);
    setRefreshToken(null);
    setDecodedTokenInfo(null);
    setProfileRequired(false);
    setPwdChangeRequired(false);
    navigate('/login');
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    if (isMockAuth) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('accesstoken');
    const storedRole = localStorage.getItem('role') as UserRole | null;
    
    if (!token || !storedRole) {
      setIsLoading(false);
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded) {
      clearAuthState();
      setIsLoading(false);
      return;
    }

    setDecodedTokenInfo(decoded);
    setAccessToken(token);
    setRefreshToken(localStorage.getItem('refreshtoken'));
    setRole(storedRole);
    setProfileRequired(localStorage.getItem('profile_required') === 'true');
    setPwdChangeRequired(localStorage.getItem('pwd_change_required') === 'true');

    try {
      // Load user details from members list
      let members: User[] = [];
      if (storedRole === 'SADMIN') {
        members = await superAdminService.getMembers();
      } else if (storedRole === 'ADMIN') {
        members = await adminService.getMembers();
      } else {
        members = await userService.getMembers();
      }

      // Find the logged-in user in the members list
      const currentUser = members.find((m) => m.user_id === decoded.sub);
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Fallback placeholder if not found in list (e.g. newly registered and not indexed yet)
        setUser({
          user_id: decoded.sub,
          name: 'Active User',
          email: '',
          phno: '',
          role: storedRole
        });
      }
    } catch (error) {
      console.error('Failed to load profile user details:', error);
      // Don't log out yet on query failure, access token is still active
      setUser({
        user_id: decoded.sub,
        name: storedRole === 'SADMIN' ? 'Super Admin User' : storedRole === 'ADMIN' ? 'Admin User' : 'Standard User',
        email: '',
        phno: '',
        role: storedRole
      });
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  // Handle auto login check on mount
  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to token refresh failures (dispatched from api.ts)
  useEffect(() => {
    const handleLogoutEvent = () => {
      showError('Your session has expired. Please log in again.', 'Unauthorized');
      clearAuthState();
    };

    window.addEventListener('auth_logout_redirect', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth_logout_redirect', handleLogoutEvent);
    };
  }, [clearAuthState, showError]);

  const login = async (data: LoginRequest): Promise<{ role: UserRole; phoneRequired: boolean; profileRequired: boolean; pwdChangeRequired: boolean }> => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      localStorage.setItem('accesstoken', response.accesstoken);
      localStorage.setItem('refreshtoken', response.refreshtoken);
      localStorage.setItem('role', response.role); // Store target role context
      
      setAccessToken(response.accesstoken);
      setRefreshToken(response.refreshtoken);
      setRole(response.role as UserRole);

      const decoded = decodeJwt(response.accesstoken);
      setDecodedTokenInfo(decoded);

      const phoneRequired = !!response.phone_required;
      const profileRequired = !!response.profile_required;
      const pwdChangeRequired = !!response.pwd_change_required;

      localStorage.setItem('profile_required', profileRequired ? 'true' : 'false');
      localStorage.setItem('pwd_change_required', pwdChangeRequired ? 'true' : 'false');
      setProfileRequired(profileRequired);
      setPwdChangeRequired(pwdChangeRequired);

      if (!phoneRequired && !profileRequired && !pwdChangeRequired) {
        showSuccess(`Welcome back! Logged in as ${response.role}`, 'Login Successful');
        // Fetch profile details
        await refreshProfile();
      } else {
        setIsLoading(false);
      }
      
      return { role: response.role as UserRole, phoneRequired, profileRequired, pwdChangeRequired };
    } catch (error) {
      showApiError(error, 'Login failed. Please verify credentials.');
      setIsLoading(false);
      throw error;
    }
  };

  const verifyPhoneNumber = async (phno: string): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.verifyPhone(phno);
      showSuccess('Phone number registered successfully.', 'Verification Complete');
      
      // Fetch details since user now has phno
      await refreshProfile();
    } catch (error) {
      showApiError(error, 'Phone verification failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitProfile = async (profileData: any): Promise<void> => {
    setIsLoading(true);
    try {
      const userId = user?.user_id || decodedTokenInfo?.sub || "";
      const payload = {
        user_id: userId,
        ...profileData
      };
      await authService.addProfile(payload);
      showSuccess('Profile details submitted successfully.', 'Profile Completed');
      
      localStorage.setItem('profile_required', 'false');
      setProfileRequired(false);

      // Reload profile details
      await refreshProfile();
    } catch (error) {
      showApiError(error, 'Profile submission failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      showSuccess('You have logged out successfully.', 'Logout');
    } catch (error) {
      console.warn('Backend logout failed, clearing local state anyway:', error);
    } finally {
      clearAuthState();
      setIsLoading(false);
    }
  };

  const signup = async (data: SignUpRequest) => {
    setIsLoading(true);
    try {
      if (role === 'SADMIN') {
        await authService.sadminSignup(data);
      } else {
        await authService.signup(data);
      }
      showSuccess(`Account for ${data.name} was successfully created. Check email.`, 'Signup Successful');
    } catch (error) {
      showApiError(error, 'Registration failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserPassword = async (password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.changePassword(password);
      showSuccess('Password updated successfully.', 'Change Successful');
      localStorage.setItem('pwd_change_required', 'false');
      setPwdChangeRequired(false);
    } catch (error) {
      showApiError(error, 'Password update failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
        signup,
        verifyPhoneNumber,
        submitProfile,
        refreshProfile,
        decodedTokenInfo,
        profileRequired,
        pwdChangeRequired,
        changeUserPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
