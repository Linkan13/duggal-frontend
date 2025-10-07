import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Plugins CSS
import "flatpickr/dist/flatpickr.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "select2/dist/css/select2.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "summernote/dist/summernote-lite.min.css";
import "bootstrap-tagsinput/dist/bootstrap-tagsinput.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./assets/css/style.css";

// App
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);
