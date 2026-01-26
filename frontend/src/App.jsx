import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerificationCode from "./pages/VerificationCode";
import SetNewPassword from "./pages/SetNewPassword";
import DashboardPage from "./pages/DashboardPage";
import PetitionsPage from "./pages/PetitionsPage";
import CreatePetitionPage from "./pages/CreatePetitionPage";
import PollsPage from "./pages/PollsPage";
import CreatePollPage from "./pages/CreatePollPage";
import OfficialsPage from "./pages/OfficialsPage";
import ReportsPage from "./pages/ReportsPage";
import CreateReportPage from "./pages/CreateReportPage";
import './styles/CivixGlobalFixes.css';
function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // ✅ ADDED: State to store verified OTP
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
          setOtpProp={setOtp} // ✅ PASS SETTER: To save verified OTP
        />
      )}

      {page === "reset" && (
        <SetNewPassword 
          setPage={setPage} 
          emailProp={email} 
          isRegistration={false} 
          otpProp={otp} // ✅ PASS VALUE: To send OTP with new password
        />
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <DashboardPage onNavigate={setPage} onLogout={() => setPage("login")} />
      )}

      {/* PETITIONS */}
      {page === "petitions" && (
        <PetitionsPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {page === "create-petition" && (
        <CreatePetitionPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {/* POLLS */}
      {page === "polls" && (
        <PollsPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {page === "create-poll" && (
        <CreatePollPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {/* OFFICIALS */}
      {page === "officials" && (
        <OfficialsPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {/* REPORTS */}
      {page === "reports" && (
        <ReportsPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}

      {/* CREATE REPORT PAGE */}
      {page === "create-report" && (
        <CreateReportPage 
          onNavigate={setPage} 
          onLogout={() => setPage("login")} 
        />
      )}
    </div>
  );
}

export default App;
