import http from "http";
import SocketService from "./services/socket.service";

async function init() {
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const port = process.env.PORT || 9200;
  socketService.io.attach(httpServer);

  httpServer.listen(port, () => {
    console.log(`Http server listening on ${port}`);
  });

  socketService.initListener();
}

init();
