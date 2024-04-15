import mongoose from "mongoose";

const { ATLAS_URI } = process.env;
const uri = ATLAS_URI || "";

let connectCount = 0;

const dbConnect = () =>
  mongoose
    .connect(uri, { dbName: "vegwins" })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.log(err);

      if (connectCount < 3) {
        connectCount++;
        dbConnect();
      }
    });

dbConnect();
