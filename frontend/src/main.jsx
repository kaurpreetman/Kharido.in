import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"

import { GoogleOAuthProvider } from '@react-oauth/google'
import {store }from '../src/context/store.js';

import { Provider } from "react-redux";
const clientId = import.meta.env.VITE_CLIENT_ID;
createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}> 
  <BrowserRouter>
  
  
   
  <App />


  
  </BrowserRouter>
     </Provider>  
  </GoogleOAuthProvider>

  
)