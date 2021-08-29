import path from "path";
import envVars from "preact-cli-plugin-env-vars";

export default function (config, env, helpers) {
  Object.assign(config.resolve.alias, {
    assets: path.resolve(__dirname, "src/assets"),
    components: path.resolve(__dirname, "src/components"),
    contexts: path.resolve(__dirname, "src/contexts"),
    helpers: path.resolve(__dirname, "src/helpers"),
    hooks: path.resolve(__dirname, "src/hooks"),
  });

  envVars(config, env, helpers);
  config.node.process = true;
  config.node.Buffer = true;
}
