import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  User,
  Lock,
  Phone,

  ArrowLeft,
  Link2,
  MapPin,
  Code,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';
import type { UserRole } from '../types';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export const Login: React.FC = () => {
  const { login, verifyPhoneNumber, submitProfile, changeUserPassword, isAuthenticated, user, profileRequired, pwdChangeRequired, role: currentRole } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);

  // Flow control step: 'login' | 'change_password' | 'verify_phone' | 'verify_profile'
  const [step, setStep] = useState<'login' | 'change_password' | 'verify_phone' | 'verify_profile'>('login');
  
  // Phone verification state
  const [verifyPhno, setVerifyPhno] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Firebase OTP states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Only initialize if it hasn't been initialized yet
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (e) {
        console.error("Recaptcha Init Error", e);
      }
    }

    // Cleanup function for React StrictMode
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {
          console.error("Cleanup error", e);
        }
      }
    };
  }, []);

  // Profile creation states
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [skillsStr, setSkillsStr] = useState(''); // comma-separated
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  // Experience sub-form
  const [experiences, setExperiences] = useState<any[]>([]);
  const [expCompany, setExpCompany] = useState('');
  const [expDesignation, setExpDesignation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrentlyWorking, setExpCurrentlyWorking] = useState(false);

  // Education sub-form
  const [educations, setEducations] = useState<any[]>([]);
  const [eduCollege, setEduCollege] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduBranch, setEduBranch] = useState('');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');

  // Redirect to verify phone / profile if authenticated but incomplete (e.g. on page refresh)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (pwdChangeRequired) {
        setStep('change_password');
      } else if (user.phno === 'N/A') {
        setStep('verify_phone');
      } else if (profileRequired) {
        setStep('verify_profile');
      }
      if (currentRole) {
        setRole(currentRole);
      }
    }
  }, [isAuthenticated, user, profileRequired, pwdChangeRequired, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!username.trim()) {
      showError('Username is required.', 'Validation Error');
      return;
    }
    if (!password) {
      showError('Password is required.', 'Validation Error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        username,
        password,
      });

      if (result.pwdChangeRequired) {
        setStep('change_password');
      } else if (result.phoneRequired) {
        setStep('verify_phone');
      } else if (result.profileRequired) {
        setStep('verify_profile');
      } else {
        // Redirect directly based on role
        if (result.role === 'SADMIN') {
          navigate('/sadmin');
        } else if (result.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Login submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Unused Firebase phone verification system preserved for future use
  const handleVerifySubmitFirebase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showOtpInput) {
      if (verifyPhno.length !== 10 || !/^\d+$/.test(verifyPhno)) {
        showError('Phone number must be exactly 10 digits.', 'Validation Error');
        return;
      }
      setIsVerifying(true);
      try {
        const appVerifier = window.recaptchaVerifier;
        // Prepending India country code (+91) - change if needed
        const formattedPhno = `+91${verifyPhno}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhno, appVerifier);
        setConfirmationResult(confirmation);
        setShowOtpInput(true);
        // Using showError as a hacky toast for success just to notify the user
        showError('OTP sent successfully to your phone!', 'Success'); 
      } catch (err) {
        console.error('Firebase OTP error:', err);
        showError('Failed to send OTP. Please try again.', 'Error');
      } finally {
        setIsVerifying(false);
      }
      return;
    }

    // Verify the OTP
    if (!verificationCode || verificationCode.length !== 6) {
      showError('Please enter a valid 6-digit OTP.', 'Validation Error');
      return;
    }

    setIsVerifying(true);

    try {
      if (confirmationResult) {
        await confirmationResult.confirm(verificationCode);
      }

      await verifyPhoneNumber(verifyPhno);

      // After phone registration, check if profile is also required
      if (profileRequired) {
        setStep('verify_profile');
      } else {
        if (role === 'SADMIN') {
          navigate('/sadmin');
        } else if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Phone verification submit error:', err);
      showError('Invalid OTP. Please try again.', 'Error');
    } finally {
      setIsVerifying(false);
    }
  };

  if (false as boolean) {
    console.log(handleVerifySubmitFirebase);
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.', 'Validation Error');
      return;
    }
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long.', 'Validation Error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeUserPassword(newPassword);
      // Next step: Phone number verification
      if (user && user.phno === 'N/A') {
        setStep('verify_phone');
      } else if (profileRequired) {
        setStep('verify_profile');
      } else {
        if (role === 'SADMIN') {
          navigate('/sadmin');
        } else if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Password change submit error:', err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verifyPhno.length !== 10 || !/^\d+$/.test(verifyPhno)) {
      showError('Phone number must be exactly 10 digits.', 'Validation Error');
      return;
    }

    setIsVerifying(true);

    try {
      await verifyPhoneNumber(verifyPhno);

      // After phone registration, check if profile is also required
      if (profileRequired) {
        setStep('verify_profile');
      } else {
        if (role === 'SADMIN') {
          navigate('/sadmin');
        } else if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Phone verification submit error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Add sub-experience
  const addExperience = () => {
    if (!expCompany.trim() || !expDesignation.trim() || !expStartDate) {
      showError('Please fill in Company Name, Designation, and Start Date.', 'Validation Error');
      return;
    }
    const newExp = {
      company: expCompany.trim(),
      designation: expDesignation.trim(),
      start_date: expStartDate,
      end_date: expCurrentlyWorking ? null : (expEndDate || null),
      currently_working: expCurrentlyWorking,
    };
    setExperiences([...experiences, newExp]);
    setExpCompany('');
    setExpDesignation('');
    setExpStartDate('');
    setExpEndDate('');
    setExpCurrentlyWorking(false);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Add sub-education
  const addEducation = () => {
    if (!eduCollege.trim() || !eduDegree.trim() || !eduBranch.trim() || !eduStartDate || !eduEndDate) {
      showError('Please fill in College Name, Degree, Branch, and both dates.', 'Validation Error');
      return;
    }
    const newEdu = {
      college: eduCollege.trim(),
      degree: eduDegree.trim(),
      branch: eduBranch.trim(),
      start_date: eduStartDate,
      end_date: eduEndDate,
    };
    setEducations([...educations, newEdu]);
    setEduCollege('');
    setEduDegree('');
    setEduBranch('');
    setEduStartDate('');
    setEduEndDate('');
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizeUrl = (url: string): string => {
      const trimmed = url.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }
      return `https://${trimmed}`;
    };

    // Split skills by commas and filter empty items
    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let finalEducations = [...educations];
    if (
      finalEducations.length === 0 &&
      eduCollege.trim() &&
      eduDegree.trim() &&
      eduBranch.trim() &&
      eduStartDate.trim() &&
      eduEndDate.trim()
    ) {
      finalEducations.push({
        college: eduCollege.trim(),
        degree: eduDegree.trim(),
        branch: eduBranch.trim(),
        start_date: eduStartDate,
        end_date: eduEndDate,
      });
    }

    const profilePayload = {
      linkedin: sanitizeUrl(linkedin),
      github: sanitizeUrl(github),
      skills,
      experience: experiences,
      education: finalEducations,
      address: {
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        country: address.country.trim(),
        pincode: address.pincode.trim(),
      },
    };

    setIsLoading(true);

    try {
      await submitProfile(profilePayload);
      
      // Redirect based on role context
      if (role === 'SADMIN') {
        navigate('/sadmin');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      console.error('Profile submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (step === 'login') return 'Authentication Portal';
    if (step === 'change_password') return 'Update Your Password';
    if (step === 'verify_phone') return 'Phone Registration';
    return 'Complete Your Profile';
  };

  return (
    <div className="w-full min-h-screen px-6 flex items-center justify-center relative z-10">
      <div className={`w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 pt-20 pb-24 transition-all duration-500 ${step === 'verify_profile' ? 'max-w-7xl' : 'max-w-6xl'}`}>
        
        {/* Left Side: Logo */}
        <div className={`w-full flex justify-center lg:justify-end transition-all duration-500 ${step === 'verify_profile' ? 'lg:w-1/3' : 'lg:w-1/2'}`}>
          <img 
            src="/Logo.jpeg" 
            alt="DextroSage Logo" 
            className={`object-contain rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all duration-500 ${step === 'verify_profile' ? 'w-24 h-24 lg:w-48 lg:h-48' : 'w-32 h-32 lg:w-64 lg:h-64'}`} 
          />
        </div>

        {/* Right Side: Login Box */}
        <div className={`w-full flex justify-center lg:justify-start transition-all duration-500 ${step === 'verify_profile' ? 'lg:w-2/3' : 'lg:w-1/2'}`}>
          <div className={`w-full max-w-md transition-all duration-500 relative z-10 ${step === 'verify_profile' ? 'lg:max-w-2xl xl:max-w-3xl' : ''}`}>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-black/20 border-b border-white/5 text-center py-5">
                <span className="text-xs font-bold text-white/70 uppercase tracking-[0.2em]">
                  {getHeaderTitle()}
                </span>
              </div>
              <div className="px-6 py-8 sm:px-10 sm:py-10">
              {/* Hidden Recaptcha Container */}
              <div id="recaptcha-container" className="hidden"></div>
              {step === 'login' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-6">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      label="Username"
                      id="username"
                      type="text"
                      placeholder="e.g. USR-A1B2C3D4"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-12"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-6">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      label="Password"
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-12"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Sign In Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-full bg-white text-black font-[600] text-[16px] hover:scale-[1.02] hover:bg-gray-200 transition-all shadow-[0_8px_24px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>
              )}

            {step === 'change_password' && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Password Change Required</h3>
                  <p className="text-xs text-gray-500">
                    For security reasons, you must change your temporary password before accessing the system.
                  </p>
                </div>

                {/* New Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    label="New Password"
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isChangingPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    disabled={isChangingPassword}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    label="Confirm New Password"
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isChangingPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    disabled={isChangingPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 shadow-md"
                    isLoading={isChangingPassword}
                  >
                    Update Password and Proceed
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-all focus:outline-none"
                    disabled={isChangingPassword}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {step === 'verify_phone' && (
              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-semibold text-white">Phone Registration Required</h3>
                  <p className="text-xs text-gray-400">
                    Your account needs to register a phone number before you can access the dashboard.
                  </p>
                </div>

                {/* Phone Number Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    label="Phone Number"
                    id="verify-phno"
                    type="tel"
                    placeholder="e.g. 9876543210 (10 digits)"
                    value={verifyPhno}
                    onChange={(e) => setVerifyPhno(e.target.value)}
                    className="pl-10"
                    disabled={isVerifying || showOtpInput}
                    maxLength={10}
                    required
                  />
                </div>

                {showOtpInput && (
                  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      label="6-Digit OTP"
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="pl-10 tracking-widest font-mono text-center"
                      disabled={isVerifying}
                      maxLength={6}
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-4 rounded-full bg-white text-black font-[600] text-[16px] hover:scale-[1.02] hover:bg-gray-200 transition-all shadow-[0_8px_24px_rgba(255,255,255,0.15)] disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isVerifying ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      showOtpInput ? 'Verify OTP and Proceed' : 'Send OTP'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (profileRequired) {
                        setStep('verify_profile');
                      } else {
                        navigate(currentRole === 'ADMIN' ? '/admin' : '/user');
                      }
                    }}
                    className="flex items-center justify-center py-2 text-sm font-semibold text-white/70 hover:text-white transition-all focus:outline-none"
                    disabled={isVerifying}
                  >
                    {showOtpInput ? 'Verify OTP and Proceed' : 'Verify Phone Number'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-all focus:outline-none"
                    disabled={isVerifying}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {step === 'verify_profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Developer Profile Details
                  </h3>
                  <p className="text-xs text-gray-400">
                    Submit your portfolio, professional experiences, and qualifications.
                  </p>
                </div>

                <hr className="border-white/10" />

                {/* Section 1: Professional Links */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-gray-400" />
                    <span>Professional Handles</span>
                    <span className="text-red-500 font-bold">*</span>
                    <span className="text-[10px] text-red-400 font-normal lowercase tracking-normal normal-case ml-auto">(Required)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="LinkedIn URL"
                      id="linkedin"
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <Input
                      label="GitHub URL"
                      id="github"
                      type="text"
                      placeholder="github.com/username"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Section 2: Skills */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-gray-400" />
                    Developer Skills
                  </h4>
                  <Input
                    label="Skills (Comma-separated)"
                    id="skills"
                    type="text"
                    placeholder="e.g. React, TypeScript, Node.js, FastAPI, MongoDB"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Section 3: Address */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Mailing Address</span>
                    <span className="text-red-500 font-bold">*</span>
                    <span className="text-[10px] text-red-400 font-normal lowercase tracking-normal normal-case ml-auto">(Required)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Street / Landmark"
                        id="street"
                        type="text"
                        placeholder="123 Developer Highway"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Input
                      label="Pincode"
                      id="pincode"
                      type="text"
                      placeholder="94016"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      id="city"
                      type="text"
                      placeholder="Techville"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                    <Input
                      label="State"
                      id="state"
                      type="text"
                      placeholder="California"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                    <Input
                      label="Country"
                      id="country"
                      type="text"
                      placeholder="United States"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Section 4: Work Experience */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    Work History ({experiences.length})
                  </h4>

                  {experiences.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 divide-y divide-gray-100 max-h-48 overflow-y-auto space-y-2">
                      {experiences.map((exp, index) => (
                        <div key={index} className="flex justify-between items-start pt-2 first:pt-0">
                          <div>
                            <p className="text-xs font-bold text-gray-200">{exp.designation}</p>
                            <p className="text-xxs text-gray-400">{exp.company}</p>
                            <p className="text-xxs text-gray-400 font-mono">
                              {exp.start_date} to {exp.currently_working ? 'Present' : exp.end_date}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Experience mini-form */}
                  <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Company Name"
                        id="exp-company"
                        type="text"
                        placeholder="e.g. Google"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        disabled={isLoading}
                      />
                      <Input
                        label="Designation / Role"
                        id="exp-designation"
                        type="text"
                        placeholder="e.g. Frontend Engineer"
                        value={expDesignation}
                        onChange={(e) => setExpDesignation(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <Input
                        label="Start Date"
                        id="exp-start"
                        type="date"
                        value={expStartDate}
                        onChange={(e) => setExpStartDate(e.target.value)}
                        disabled={isLoading}
                      />
                      <Input
                        label="End Date"
                        id="exp-end"
                        type="date"
                        value={expEndDate}
                        onChange={(e) => setExpEndDate(e.target.value)}
                        disabled={isLoading || expCurrentlyWorking}
                      />
                      <div className="flex items-center h-10 mb-2">
                        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expCurrentlyWorking}
                            onChange={(e) => setExpCurrentlyWorking(e.target.checked)}
                            className="rounded border-gray-600 bg-black/50 text-blue-400 focus:ring-brand-500 h-4 w-4"
                            disabled={isLoading}
                          />
                          <span>Currently Working</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xxs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-md transition-all"
                        disabled={isLoading}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Experience
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 5: Education */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>Academic Records ({educations.length})</span>
                    <span className="text-red-500 font-bold">*</span>
                    <span className="text-[10px] text-red-400 font-normal lowercase tracking-normal normal-case ml-auto">(At least 1 required)</span>
                  </h4>

                  {educations.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 divide-y divide-gray-100 max-h-48 overflow-y-auto space-y-2">
                      {educations.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start pt-2 first:pt-0">
                          <div>
                            <p className="text-xs font-bold text-gray-200">{edu.college}</p>
                            <p className="text-xxs text-gray-400">{edu.degree} - {edu.branch}</p>
                            <p className="text-xxs text-gray-400 font-mono">
                              {edu.start_date} to {edu.end_date}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Education mini-form */}
                  <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="College / School"
                          id="edu-college"
                          type="text"
                          placeholder="e.g. Stanford University"
                          value={eduCollege}
                          onChange={(e) => setEduCollege(e.target.value)}
                          disabled={isLoading}
                          required={educations.length === 0}
                        />
                      </div>
                      <Input
                        label="Degree"
                        id="edu-degree"
                        type="text"
                        placeholder="e.g. B.Tech"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        disabled={isLoading}
                        required={educations.length === 0}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <Input
                        label="Branch / Specialization"
                        id="edu-branch"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={eduBranch}
                        onChange={(e) => setEduBranch(e.target.value)}
                        disabled={isLoading}
                        required={educations.length === 0}
                      />
                      <Input
                        label="Start Date"
                        id="edu-start"
                        type="date"
                        value={eduStartDate}
                        onChange={(e) => setEduStartDate(e.target.value)}
                        disabled={isLoading}
                        required={educations.length === 0}
                      />
                      <Input
                        label="End Date"
                        id="edu-end"
                        type="date"
                        value={eduEndDate}
                        onChange={(e) => setEduEndDate(e.target.value)}
                        disabled={isLoading}
                        required={educations.length === 0}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xxs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-md transition-all"
                        disabled={isLoading}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Education
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Profile and Cancel Buttons */}
                <div className="flex flex-col gap-3 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-white text-black font-[600] text-[16px] hover:scale-[1.02] hover:bg-gray-200 transition-all shadow-[0_8px_24px_rgba(255,255,255,0.15)] disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Submit Profile and Finish'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-all focus:outline-none"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
              {/* Hidden Recaptcha Container */}
              <div id="recaptcha-container" className="hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
