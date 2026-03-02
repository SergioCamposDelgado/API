import { PrivateRoute } from "./PrivateRoute";
import { AdminPanel } from "../pages/AdminPanel";

export function AdminPanelRoute() {
  return (
    <PrivateRoute requireAdmin>
      <AdminPanel />
    </PrivateRoute>
  );
}
