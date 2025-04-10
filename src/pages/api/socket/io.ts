import { NextApiResponseServerIo } from "@/lib/types";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  const socketServer = res?.socket?.server;
  if (!socketServer) {
    res.status(500).end("Socket server is not available.");
    return;
  }
  if (!socketServer.io) {
    console.log("setting up th socket io");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    io.on("connection", (s) => {
      console.log("Client connected", s.id);
      s.on("create-room", (fileId) => {
        s.join(fileId);
      });
      s.on("send-changes", (deltas, fileId) => {
        console.log("CHANGE");
        s.to(fileId).emit("receive-changes", deltas, fileId);
      });
      s.on("send-cursor-move", (range, fileId, cursorId) => {
        s.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
