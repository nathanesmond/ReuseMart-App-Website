import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Routes"; 
import './index.css';
import "react-toastify/dist/ReactToastify.css";



const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
