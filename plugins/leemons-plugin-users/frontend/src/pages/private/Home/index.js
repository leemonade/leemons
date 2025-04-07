import constants from "@users/constants";
import { goSelectProfilePage } from "@users/navigate";
import { logoutSession } from "@users/session";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getCentersWithToken } from '../../../session';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/private/dashboard");
  }, []);

  // console.log(getCentersWithToken());

  const logout = () => {
    logoutSession(navigate, `/${constants.base}`);
  };

  return (
    <div>
      <button
        className="absolute right-20 top-2 px-2 border border-gray-500 rounded"
        onClick={() => goSelectProfilePage(navigate)}
      >
        Cambiar perfil
      </button>

      <button
        className="absolute right-2 top-2 px-2 border border-gray-500 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
