// components/common/GlobalLoader.tsx
import { useGlobalLoader } from "@/hooks/loader";

export default function GlobalLoader() {
  const { showLoader } = useGlobalLoader();

  if (!showLoader) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-50"
      style={{ zIndex: 2000 }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
