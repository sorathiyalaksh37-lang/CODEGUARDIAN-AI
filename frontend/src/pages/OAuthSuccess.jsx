import {
  useEffect,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const OAuthSuccess = () => {

  const navigate =
    useNavigate();

  const [params] =
    useSearchParams();

  useEffect(() => {

    const token =
      params.get("token");

    if (token) {

      localStorage.setItem(
        "token",
        token
      );

      navigate("/dashboard");

    } else {

      navigate("/login");

    }

  }, []);

  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      text-3xl
      font-bold
      "
    >

      Logging you in...

    </div>

  );

};

export default OAuthSuccess;