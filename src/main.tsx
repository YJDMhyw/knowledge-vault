import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp'
import './index.css'

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <SimpleApp />
    </StrictMode>,
  );
}