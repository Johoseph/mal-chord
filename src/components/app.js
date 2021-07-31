import { h } from "preact";

import { useUser } from "../hooks";
import LoggedIn from "./LoggedIn";

const App = () => {
  const { loggedIn } = useUser();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return (
    <div id="app">{loggedIn ? <LoggedIn /> : <div>Logging in...</div>}</div>
  );
};

export default App;
