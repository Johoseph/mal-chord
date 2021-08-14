import { h } from "preact";
import { useMemo } from "preact/hooks";

import { UserPath } from "./paths/UserPath";
import { GuestPath } from "./paths/GuestPath";
import { HomePath } from "./paths/HomePath";
import { useLoginType } from "../hooks";
import { UserContext } from "../contexts";

const App = () => {
  const { loginType, setLoginType } = useLoginType();

  const userContext = useMemo(() => ({ setLoginType }), [setLoginType]);

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
