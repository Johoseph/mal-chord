import { h } from "preact";

import { useUser } from "../hooks";
import { GraphError } from "./error/GraphError";
import LoggedIn from "./LoggedIn";
import LoggingIn from "./LoggingIn";

const App = () => {
  const { loggedIn, loginError } = useUser();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  if (loginError)
    return (
      <div id="app">
        <GraphError
          refetch={() =>
            (window.location.href = process.env.PREACT_APP_BASE_URL)
          }
        />
      </div>
    );

  return <div id="app">{loggedIn ? <LoggedIn /> : <LoggingIn />}</div>;
};

export default App;
