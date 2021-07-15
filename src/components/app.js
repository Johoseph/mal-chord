import { h } from "preact";

import { useUser } from "../hooks";
import { Overview } from "./overview";

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
        </>
      ) : (
        <div>Logging in...</div>
      )}
    </div>
  );
};

export default App;
