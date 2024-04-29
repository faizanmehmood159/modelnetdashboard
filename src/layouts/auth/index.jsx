import { Routes, Route, Navigate } from "react-router-dom";
import authRoutes from "../../authRoutes";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div>
      <Routes>
        {getRoutes(authRoutes)}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </div>
  );
}
