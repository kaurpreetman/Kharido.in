
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import ShopContextProvider from './context/ShopContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
  <ShopContextProvider>
    <GoogleOAuthProvider clientId='889165511247-v2r6frdj65fhfabrjh5r71e5ngstmjhl.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </ShopContextProvider>
  
  </BrowserRouter>
   

  
)
