import { h } from "preact";

import { useUser } from "../hooks";
import LoggedIn from "./LoggedIn";
import LoggingIn from "./LoggingIn";

const App = () => {
  const { loggedIn } = useUser();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return <div id="app">{loggedIn ? <LoggedIn /> : <LoggingIn />}</div>;
};

export default App;
