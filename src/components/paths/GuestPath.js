import { h } from "preact";
import { LoggedIn } from "./user/LoggedIn";

export const GuestPath = () => {
  return <LoggedIn useMock={true} />;
};
