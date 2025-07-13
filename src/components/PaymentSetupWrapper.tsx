import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSetup from './PaymentSetup';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface PaymentSetupWrapperProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentSetupWrapper({ onSuccess, onCancel }: PaymentSetupWrapperProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentSetup onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
} 