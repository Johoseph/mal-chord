import { h } from "preact";
import { LoggedIn } from "components";

export const GuestPath = () => {
  return <LoggedIn useMock={true} />;
};
