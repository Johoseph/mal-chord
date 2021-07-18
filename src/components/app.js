import { h } from "preact";

import { useUser } from "../hooks";
import { Overview } from "./overview";
import { Graph } from "./graph";

const App = () => {
  const { loggedIn } = useUser();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return (
    <div id="app">
      {loggedIn ? (
        <>
          <Overview />
          <Graph />
        </>
      ) : (
        <div>Logging in...</div>
      )}
    </div>
  );
};

export default App;
