import { Router } from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import User from "../db/schema/user";
import nicknameMaker from "../constants/nickname";
const authRouter = Router();

authRouter.use(
  cors({
    origin: ["http://localhost:3000", "https://vegwins.vercel.app"],
    credentials: true,
  })
);

authRouter.post("/google", async (req, res, next) => {
  const { credential } = req.body;
  const { ID_GOOGLE: client_id, PW_GOOGLE: client_secret } = process.env;
  if (credential) {
    try {
      const client = new OAuth2Client(client_id);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: client_id,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        res.status(400).send({ msg: "구글 로그인 토큰 에러" });
        return;
      }
      const currentUser = await User.findOne({ email: payload?.email });
      if (!currentUser) {
        const { email } = payload;
        const newUser = await User.create({
          email,
          nickname: nicknameMaker(),
          provider: "google",
        });
        newUser.save();
      }
      //토큰
    } catch (e) {
      next(e);
    }
  }

  // const { code } = req.query as { code: string; scope: string };
  // const profile = await fetch("https://oauth2.googleapis.com/token", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     code,
  //     client_id,
  //     client_secret,
  //     redirect_uri: "http://localhost:8000/auth/google",
  //     grant_type: "authorization_code",
  //   }),
  // }).then((resp) => resp.text());
  // console.log(profile);

  res.status(400).send({ text: "hi" });
});

export default authRouter;
