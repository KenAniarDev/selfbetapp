import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordStep, setShowPasswordStep] = useState(false);

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth sign-up
    console.log('Google sign-up clicked');
  };

  const handleEmailSignup = () => {
    setShowPasswordStep(true);
  };

  const handleConfirmSignup = () => {
    // TODO: Implement email signup with password
    console.log('Confirm signup with:', { firstName, lastName, email, password });
  };

  const isStep1Valid = firstName.trim() && lastName.trim() && email.trim();
  const isStep2Valid = password.trim() && confirmPassword.trim() && password === confirmPassword;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Join Self-Bet</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Create your account and start achieving your goals
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showPasswordStep && (
              <>
                <Button 
                  onClick={handleGoogleSignUp}
                  className="w-full h-12 text-base font-medium"
                  variant="outline"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or sign up with email
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleEmailSignup}
                    className="w-full h-12 text-base font-medium"
                    disabled={!isStep1Valid}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {showPasswordStep && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  onClick={handleConfirmSignup}
                  className="w-full h-12 text-base font-medium"
                  disabled={!isStep2Valid}
                >
                  Create Account
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage; 