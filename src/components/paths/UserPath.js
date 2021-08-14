import { h } from "preact";
import { useUser } from "../../hooks";
import { LoggedIn } from "./user/LoggedIn";
import { LoggingIn } from "./user/LoggingIn";

export const UserPath = () => {
  const { loggedIn, loginError } = useUser();

  return loggedIn ? (
    <LoggedIn useMock={false} />
  ) : (
    <LoggingIn loginError={loginError} />
  );
};
