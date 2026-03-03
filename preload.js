

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  startExam: (url) => ipcRenderer.send("start-exam", url),
  saveAuth: (token, email) => ipcRenderer.send("save-auth", { token, email }),
  getAuth: () => ipcRenderer.invoke("get-auth")
});
