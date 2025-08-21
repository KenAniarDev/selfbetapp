import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentSetup from "./PaymentSetup";
import { stripeConfig } from "@/config/stripe";

// Initialize Stripe with configuration
const stripePromise = loadStripe(stripeConfig.publishableKey);

interface PaymentSetupWrapperProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentSetupWrapper({
  onSuccess,
  onCancel,
}: PaymentSetupWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentSetup onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
