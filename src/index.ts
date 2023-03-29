import { Plugin as T_Plugin } from "esbuild";



interface I_ENV_PLUGIN_CREATER_OPTIONS {
  current: { //It`s represents a list of exported variables from a virtual module
    [k: T_VAR_NAME]: any;
  },
  moduleName: string, //It will be used to resolve created virtual module
};
type T_VAR_NAME = string;

const PLUGIN_NAME = "EnvPlugin"; //Must was string, because by docs plugin name can be only string. For more see: https://esbuild.github.io/plugins/
const RESOLVED_PATH_NAMESPACE = "envModulePath"; //Also must be string For more see: https://esbuild.github.io/plugins/#namespaces

const createEnvPlugin = (options: I_ENV_PLUGIN_CREATER_OPTIONS): T_Plugin => ({
  name: "EnvPlugin",
  setup(build) {
    const envModule = [
      Object.entries(options.current).map(([key, value])=>(`export const ${key} = ${JSON.stringify(value)};`)),
      `export default ${JSON.stringify(options.current)}`
    ].flat(1).join("\n");

    build.onResolve({filter: new RegExp(`^${options.moduleName}$`, "m")}, ({path})=>({path, namespace: RESOLVED_PATH_NAMESPACE}))
    build.onLoad({filter: /.*/m, namespace: RESOLVED_PATH_NAMESPACE}, async ()=>({contents: envModule, loader: "js"}));
  },
});


export {
  PLUGIN_NAME, RESOLVED_PATH_NAMESPACE,
  createEnvPlugin, createEnvPlugin as EnvPlugin,
};
