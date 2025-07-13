# Payment Setup Configuration

## Stripe Integration

This app uses Stripe for secure payment processing. To set up payment functionality:

### 1. Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 2. Get Your Stripe Keys

1. Sign up for a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers → API Keys
4. Copy your publishable key (starts with `pk_test_` for test mode)

### 3. Features

The Payment Setup page includes:

- ✅ **Secure Card Input** - Stripe Elements for PCI compliance
- ✅ **Real-time Validation** - Instant card number validation
- ✅ **Error Handling** - Clear error messages for failed payments
- ✅ **Success States** - Confirmation when payment method is added
- ✅ **Security Badges** - Visual indicators of security features
- ✅ **Responsive Design** - Works on mobile and desktop

### 4. Usage

Navigate to `/payment` to access the payment setup page.

### 5. Backend Integration

For production use, you'll need to:

1. Create a backend API to handle payment method creation
2. Store payment method IDs securely
3. Implement webhook handling for payment events
4. Add proper error handling and logging

### 6. Testing

Use Stripe's test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Requires Authentication**: `4000002500003155`

### 7. Security Notes

- Payment data never touches your server
- All card processing handled by Stripe
- PCI DSS compliance through Stripe Elements
- Encrypted communication with Stripe API 