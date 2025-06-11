
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"

import { GoogleOAuthProvider } from '@react-oauth/google'
import {store }from '../src/context/store.js';

import { Provider } from "react-redux";
createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId='889165511247-v2r6frdj65fhfabrjh5r71e5ngstmjhl.apps.googleusercontent.com'>
    <Provider store={store}> 
  <BrowserRouter>
  
  
   
  <App />


  
  </BrowserRouter>
     </Provider>  
  </GoogleOAuthProvider>

  
)
