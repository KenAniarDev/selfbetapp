import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from './sw-register'
import './utils/devCache'

// Register service worker with custom handling
registerSW()

createRoot(document.getElementById("root")!).render(<App />);
