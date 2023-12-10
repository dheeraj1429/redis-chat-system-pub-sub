import { Server } from "socket.io";
import Redis from "ioredis";

class SocketService {
  private _io: Server;
  public pub: Redis;
  public sub: Redis;

  constructor() {
    console.log("Initializing socket service..");
    this._io = new Server({
      cors: {
        allowedHeaders: "*",
        origin: "*",
      },
    });
    this.pub = this._configRedis();
    this.sub = this._configRedis();

    // subscribe
    this.sub.subscribe("MESSAGE");
  }

  private _configRedis() {
    const instance = new Redis({
      host: "redis-309cb58f-dheerajsingh1429-1722.a.aivencloud.com",
      port: 21548,
      username: "default",
      password: "AVNS_bn9hzYCWZTOfCo-yyHr",
    });
    return instance;
  }

  public initListener() {
    const io = this.io;
    console.log("Initializing socket listener..");
    io.on("connect", (socket) => {
      console.log(`New socket connected: ${socket.id}`);

      socket.on("event:message", async (args: { message: string }) => {
        console.log(`New message received: ${args.message}`);
        // publish this message to redis
        await this.pub.publish("MESSAGE", JSON.stringify(args.message));
      });
    });

    // listen for events from subscribers
    this.sub.on("message", (channel, message) => {
      if (channel === "MESSAGE") {
        console.log(`Message received: ${channel}:${message}`);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
