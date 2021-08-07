import { h } from "preact";

import { useUser } from "../hooks";
import LoggedIn from "./LoggedIn";
import LoggingIn from "./LoggingIn";

const App = () => {
  const { loggedIn, loginError } = useUser();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return (
    <div id="app">
      {loggedIn ? <LoggedIn /> : <LoggingIn loginError={loginError} />}
    </div>
  );
};

export default App;
