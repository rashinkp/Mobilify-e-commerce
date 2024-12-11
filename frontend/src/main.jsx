import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';
import '../fontAwesomeConfig.js'
import { Provider } from 'react-redux';
import  store  from './redux/store.js';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { clientId } from './pages/user/Login.jsx';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={clientId}>

    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);
