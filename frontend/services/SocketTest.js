import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // 握手與 WebSocket 都由這行自動處理

socket.on("connect", () => {
    console.log("已連線，socket.id =", socket.id);
    // 測試傳送自訂事件
    socket.emit("example", "Hello from test script!");
});

socket.on("example", (msg) => {
    console.log("收到伺服器廣播：", msg);
});

socket.on("disconnect", () => {
    console.log("已斷線");
});
