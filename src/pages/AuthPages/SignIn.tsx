import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Duggal Overseas - Visa & IELTS Management"
        description="Sign in to Duggal Overseas Management System for Visa and IELTS center operations. Manage applications, track progress, and streamline your workflow efficiently."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
