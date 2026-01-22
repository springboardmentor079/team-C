import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerificationCode from "./pages/VerificationCode";
import SetNewPassword from "./pages/SetNewPassword";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [tempData, setTempData] = useState(null);

  return (
    <div>
      {page === "login" && <Login onNavigate={setPage} />}

      {page === "register" && (
        <Register onNavigate={setPage} setEmailProp={setEmail} setTempData={setTempData} />
      )}

      {/* Verification for Registration Flow */}
      {page === "verify-reg" && (
        <VerificationCode
          setPage={(p) => (p === "reset" ? setPage("set-password-reg") : setPage(p))}
          emailProp={email}
          backPage="register"
        />
      )}

      {/* Password Setting for New Users */}
      {page === "set-password-reg" && (
        <SetNewPassword 
          setPage={setPage} 
          emailProp={email} 
          tempData={tempData} 
          isRegistration={true} 
        />
      )}

      {/* Forgot Password Flow */}
      {page === "forgot" && <ForgotPassword setPage={setPage} setEmailProp={setEmail} />}
      
      {page === "verify" && (
        <VerificationCode 
          setPage={setPage} 
          emailProp={email} 
          backPage="forgot" 
        />
      )}

      {page === "reset" && (
        <SetNewPassword setPage={setPage} emailProp={email} isRegistration={false} />
      )}

      {page === "dashboard" && (
        <DashboardPage onNavigate={setPage} onLogout={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;