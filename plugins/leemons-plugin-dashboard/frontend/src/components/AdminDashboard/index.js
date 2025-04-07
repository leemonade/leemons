import { useDeploymentConfig } from "@deployment-manager/hooks/useDeploymentConfig";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";

function AdminDashboard(props) {
  const navigate = useNavigate();
  const deploymentConfig = useDeploymentConfig({
    pluginName: "dashboard",
    ignoreVersion: true,
  });

  if (typeof deploymentConfig === "undefined") {
    return null;
  }

  if (deploymentConfig?.adminDashboardUrl) {
    navigate(deploymentConfig.adminDashboardUrl);
    return null;
  }

  return <Dashboard {...props} />;
}

export { AdminDashboard };
