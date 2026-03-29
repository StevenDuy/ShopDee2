"use client";

import AuthWrapper from "../components/AuthWrapper";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <AuthWrapper 
      title="Join Ecosystem" 
      subtitle="Join the recursive logistics network and start simulating."
    >
      <RegisterForm />
    </AuthWrapper>
  );
}
