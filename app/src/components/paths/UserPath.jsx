import { useUser } from "hooks";
import { LoggedIn, LoggingIn } from "components";

export const UserPath = () => {
  const { loggedIn, loginError } = useUser();

  return loggedIn ? (
    <LoggedIn useMock={false} />
  ) : (
    <LoggingIn loginError={loginError} />
  );
};
