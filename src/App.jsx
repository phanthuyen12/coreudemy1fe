import React from "react";
import { useLocation } from "react-router-dom";
import AppProvidersWrapper from "./admin/components/wrappers/AppProvidersWrapper";
import configureFakeBackend from "./admin/helpers/fake-backend";
import AppRouter from "./admin/routes/router";        // admin router
import ClientRouter from "./client/router/AppRouter"; // client router
import { AuthProvider as ClientAuthProvider } from "./client/context/AuthContext";
import "./assets/css/tailwind.css";                 // tailwind css
import "./admin/assets/scss/app.scss";               // admin scss
// import "./client/assets/css/course-theme.css";      // client dark theme

configureFakeBackend();

const App = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const module = params.get("module");

  // Add dark theme class for client mode
  React.useEffect(() => {
    if (module !== "admin") {
      document.body.classList.add('course-dark-theme');
    } else {
      document.body.classList.remove('course-dark-theme');
    }
  }, [module]);

  return (
    <AppProvidersWrapper>
      {module === "admin" ? (
        <AppRouter />
      ) : (
        <ClientAuthProvider>
          <ClientRouter />
        </ClientAuthProvider>
      )}
    </AppProvidersWrapper>
  );
};

export default App;
