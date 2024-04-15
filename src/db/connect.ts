import mongoose from "mongoose";

const { ATLAS_URI } = process.env;
const uri = ATLAS_URI || "";

let connectCount = 0;

const dbConnect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose
    .connect(uri, { dbName: "vegwins" })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.log("MongoDB initialization Error", err);

      if (connectCount < 3) {
        connectCount++;
        dbConnect();
      }
    });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB Error", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected, try to reconnect...");
    dbConnect();
  });
};

dbConnect();
