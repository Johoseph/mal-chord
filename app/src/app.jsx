import { useEffect, useMemo } from "preact/hooks";

import { UserPath, GuestPath, HomePath } from "components";
import { useLoginType, useWindowDimensions } from "hooks";
import { UserContext } from "contexts";

const mobileWidth = 840;

const App = () => {
  const { windowWidth } = useWindowDimensions();
  const { loginType, setLoginType } = useLoginType();

  if (!localStorage.getItem("BASE_URL")) {
    localStorage.setItem("BASE_URL", window.location.origin);
  }

  const userContext = useMemo(
    () => ({ setLoginType, mobileWidth }),
    [setLoginType]
  );

  useEffect(() => {
    if (windowWidth < mobileWidth) {
      setLoginType("home");
    }
  }, [setLoginType, windowWidth]);

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return (
    <UserContext.Provider value={userContext}>
      {loginType === "user" && <UserPath />}
      {loginType === "guest" && <GuestPath />}
      {loginType === "home" && <HomePath />}
    </UserContext.Provider>
  );
};

export default App;
