import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => console.log("Ping from preload script!"),
});
