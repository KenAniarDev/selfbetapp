import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/utils/api";
import { stripeConfig } from "@/config/stripe";

// Stripe configuration

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

interface PaymentSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function PaymentForm({ onSuccess, onCancel }: PaymentSetupProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (stripeError) {
        setError(stripeError.message || "Payment method creation failed");
        return;
      }

      try {
        // Call your backend to save the payment method ID
        const result = await apiService.savePaymentMethod({
          paymentMethodId: paymentMethod.id,
        });

        console.log("result:", result);

        if (result.error) {
          console.error("Save payment method error:", result.error);
          setError(result.error);
          return;
        }

        const verifyResult = await apiService.verifyCard();

        if (verifyResult.error) {
          console.error("Verify card error:", verifyResult.error);
          setError(verifyResult.error);
          return;
        }

        console.log("verifyResult:", verifyResult);

        console.log("Payment method saved to backend:", result.data);

        setSuccess(true);

        toast({
          title: "Payment Method Added!",
          description: "Your payment method has been securely saved.",
        });

        // Navigate to dashboard after successful setup
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (backendError) {
        console.error("Backend error:", backendError);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Payment setup error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Payment Method Added!
            </h3>
            <p className="text-gray-600 mb-4">
              Your payment method has been securely saved and is ready to use.
            </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <CreditCard className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method Setup
        </CardTitle>
        <CardDescription>
          Securely add your payment method to enable betting features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-element">Card Information</Label>
              <div className="mt-2 p-3 border rounded-md bg-white">
                <CardElement id="card-element" options={cardElementOptions} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={!stripe || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add Payment Method"
              )}
            </Button>

            {/* <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full"
            >
              Skip for now
            </Button> */}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function PaymentSetup({
  onSuccess,
  onCancel,
}: PaymentSetupProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Setup</h1>
          <p className="text-gray-600">
            Add a payment method to start creating bets and tracking your goals
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} />
        </div>
      </div>
    </div>
  );
}
