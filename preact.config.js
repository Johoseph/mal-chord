import path from "path";
import envVars from "preact-cli-plugin-env-vars";

export default function (config, env, helpers) {
  config.resolve.alias.src = path.resolve(__dirname, "src");
  envVars(config, env, helpers);
  config.node.process = true;
  config.node.Buffer = true;
}
