declare module "turndown-plugin-gfm" {
  type Plugin = (service: import("turndown").default) => void;

  const turndownPluginGfm: {
    gfm: Plugin;
    tables: Plugin;
    strikethrough: Plugin;
    taskListItems: Plugin;
  };

  export = turndownPluginGfm;
}
