const { Server } = require("socket.io");
const os = require("os-utils");
const nodeOs = require("os");
const gpu = require("gpu-info");

const io = new Server({
  cors: {
    origin: "http://192.168.0.106:8080",
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected! ID: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  setInterval(() => {
    os.cpuUsage((data) => {
      socket.volatile.emit("cpusage", data * 100);
    });
  }, 1000);

  setInterval(() => {
    const totalmem = os.totalmem() / 1024;
    socket.volatile.emit("cputotalmemory", totalmem);
  }, 1000);

  setInterval(() => {
    const freemem = os.freememPercentage() * 100;
    socket.volatile.emit("freememory", freemem);
  }, 1000);
  
  setInterval(() => {
    const uptime = os.sysUptime();
    socket.volatile.emit("uptimehour", uptime);
  }, 1000)

  setInterval(() => {
    gpu().then(data => {
      console.log(data);
    })
  }, 1000)

});

io.listen(8080);
