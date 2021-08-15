import { h } from "preact";
import { useEffect, useMemo } from "preact/hooks";

import { UserPath } from "./paths/UserPath";
import { GuestPath } from "./paths/GuestPath";
import { HomePath } from "./paths/HomePath";
import { useLoginType, useWindowDimensions } from "../hooks";
import { UserContext } from "../contexts";

const mobileWidth = 840;

const App = () => {
  const { windowWidth } = useWindowDimensions();
  const { loginType, setLoginType } = useLoginType();

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
    <div id="app">
      <UserContext.Provider value={userContext}>
        {loginType === "user" && <UserPath />}
        {loginType === "guest" && <GuestPath />}
        {loginType === "home" && <HomePath />}
      </UserContext.Provider>
    </div>
  );
};

export default App;
