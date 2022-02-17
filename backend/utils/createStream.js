import mongoose from 'mongoose'
import dotenv from "dotenv";
import Grid from "gridfs-stream";

//const createStream = () => {
  dotenv.config();
  const conn = mongoose.createConnection(process.env.MONGO_URI);

  let gfs;
  conn.once("open", () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
  });


//};

export default gfs