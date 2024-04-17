import { Router } from "express";
import cors from "cors";
import User from "../db/schema/user";
import nicknameMaker from "../constants/nickname";
import { setToken } from "../middlewares/jwt";
import { OAuth2Client } from "google-auth-library";
const authRouter = Router();

authRouter.use(
  cors({
    origin: ["http://localhost:3000", "https://vegwins.vercel.app"],
    credentials: true,
  })
);

authRouter.post("/google", async (req, res, next) => {
  try {
    let sub = "";
    let nickname;

    const { code, credential } = req.body;
    const { ID_GOOGLE: client_id, PW_GOOGLE: client_secret } = process.env;

    if (code) {
      const token = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          code,
          client_id,
          client_secret,
          redirect_uri: "http://localhost:3000",
          grant_type: "authorization_code",
        }),
      });
      const { access_token } = await token.json();
      const googleUser = await fetch(`https://www.googleapis.com/userinfo/v2/me?access_token=${access_token}`);
      const payload = await googleUser.json();
      sub = payload.id;
    }

    if (credential) {
      const client = new OAuth2Client(client_id);
      const ticket = await client.verifyIdToken({
        idToken: credential,
      });
      const payload = ticket.getPayload();
      if (payload) {
        sub = payload.sub;
      }
    }

    const currentUser = await User.findOne({ sub });
    if (!currentUser) {
      const newUser = await User.create({
        sub,
        nickname: nicknameMaker(sub),
        provider: "google",
      });
      nickname = newUser.nickname;
    } else {
      nickname = currentUser.nickname;
    }
    const accessToken = setToken({ sub }, "1h");
    const refreshToken = setToken({ sub }, "1d");
    res.cookie("v_at", accessToken, { maxAge: 1000 * 60 * 60, httpOnly: true, sameSite: "lax", path: "/api" });
    res.status(200).json({ refreshToken, nickname });
    return;
    //토큰
  } catch (e) {
    console.error(e);
    next(e);
  }
  res.status(400).send({ error: "잘못된 로그인입니다." });
});

export default authRouter;
