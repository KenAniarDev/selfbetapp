import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/utils/api";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the intended destination from location state, or default to '/dashboard'
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleGoogleSignUp = async () => {
    toast({
      title: "Coming Soon",
      description: "Google sign-up will be available soon.",
    });
  };

  const handleEmailSignup = () => {
    setShowPasswordStep(true);
    setError("");
  };

  const handleConfirmSignup = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await apiService.registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
      });

      console.log("result signup:", result);

      if (result.error) {
        // Check if it's a user already exists error
        if (result.error.includes("User already exists")) {
          // User exists but needs to complete payment setup
          toast({
            title: "Account Exists",
            description:
              "This email is already registered. Redirecting you to complete payment setup.",
            variant: "destructive",
          });
          // Redirect to payment setup since user exists but needs to complete payment
          navigate("/payment", {
            state: {
              message:
                "Account exists. Please complete your payment setup to continue.",
              email: email,
            },
          });
          return;
        }

        // Handle other API errors
        throw new Error(result.error);
      }

      // Success case - now sign in the user with Firebase
      try {
        // Sign in the user with Firebase after successful backend registration
        await signInWithEmailAndPassword(auth, email.trim(), password);
        console.log("User signed in to Firebase successfully");

        toast({
          title: "Account Created!",
          description:
            "Your account has been created successfully. Let's set up your payment method.",
        });

        // Navigate to payment setup after successful registration and authentication
        navigate("/payment", {
          state: {
            message:
              "Complete your payment setup to start creating goals and bets.",
            isNewUser: true,
          },
        });
      } catch (firebaseError: unknown) {
        console.error("Firebase sign-in error:", firebaseError);
        // If Firebase sign-in fails, redirect to login with helpful message
        toast({
          title: "Account Created!",
          description:
            "Your account has been created. Please sign in to continue.",
        });
        navigate("/login", {
          state: {
            message:
              "Account created successfully. Please sign in to continue.",
            email: email,
          },
        });
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = firstName.trim() && lastName.trim() && email.trim();
  const isStep2Valid =
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword &&
    password.length >= 6;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Join Self-Bet
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Create your account and start achieving your goals
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {!showPasswordStep && (
              <>
                <Button
                  onClick={handleGoogleSignUp}
                  className="w-full h-12 text-base font-medium"
                  variant="outline"
                  disabled={true}
                >
                  <>
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
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google (Coming Soon)
                  </>
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleEmailSignup}
                    className="w-full h-12 text-base font-medium"
                    disabled={!isStep1Valid || isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleConfirmSignup}
                  className="w-full h-12 text-base font-medium"
                  disabled={!isStep2Valid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Button
                  onClick={() => setShowPasswordStep(false)}
                  variant="ghost"
                  className="w-full"
                  disabled={isLoading}
                >
                  Back
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
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
