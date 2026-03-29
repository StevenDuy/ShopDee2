"use client";

import AuthWrapper from "../components/AuthWrapper";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthWrapper 
      title="Access Sandbox" 
      subtitle="Experience the high-fidelity agentic logistics ecosystem."
    >
      <LoginForm />
    </AuthWrapper>
  );
}
