import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpFormAdmin from "../../components/auth/SignUpFormAdmin";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Duggal Overseas - Visa & IELTS Management"
        description="Create your account to access Duggal Overseas Management System for Visa and IELTS center operations. Manage applications, track progress, and streamline your workflow efficiently."
      />
      <AuthLayout>
        <SignUpFormAdmin />
      </AuthLayout>
    </>
  );
}
