import { loadStripe } from "@stripe/stripe-js";

// Chave pública do Stripe (publishable key)
// Esta chave é segura para usar no frontend
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
    "pk_test_51SaxDQLOlOyBF0iPZhHWt4TsCRRYLwNaUKK1fyMhwrPu8wVSneRGWV6SNFSgIJrc5lUopURuF8Mtoa2PdJABdZ7v00yFA7ydQ8";

// Inicializar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

