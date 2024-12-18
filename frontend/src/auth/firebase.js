// Import necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDa9Tql2P1gv09eyXGZFnwL4PLGhU_MZjQ",
  authDomain: "authdemo-9af37.firebaseapp.com",
  projectId: "authdemo-9af37",
  storageBucket: "authdemo-9af37.firebasestorage.app",
  messagingSenderId: "899278657625",
  appId: "1:899278657625:web:39acc506f7b97af73fb948",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to set up reCAPTCHA and send OTP
export const sendOtp = (phoneNumber, setConfirmationResult) => {
  const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',  // Invisible reCAPTCHA
  }, auth);

  // Trigger reCAPTCHA rendering
  recaptchaVerifier.render().then(() => {
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        // Store the confirmationResult so it can be used later to verify OTP
        setConfirmationResult(confirmationResult);
        alert("OTP sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Error sending OTP: " + error.message);
      });
  }).catch((error) => {
    console.error("ReCAPTCHA error:", error);
    alert("Error setting up reCAPTCHA: " + error.message);
  });
};
