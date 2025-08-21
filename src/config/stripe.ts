// Stripe configuration
export const stripeConfig = {
  // Replace with your actual Stripe publishable key
  publishableKey:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RqeXdRgJIzKwElh1Q9lpJxZ9GgTCxRFUrFDllpo5eD7HAh2lEvE3dGUcAs0Sn9W8CcsZqVSnSbhQeCgqRVO0uxS00mX8KsOtH",

  // Backend API endpoints
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://localhost:7192",

  // Stripe Elements appearance customization
  appearance: {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
    },
  },
};

export default stripeConfig;
