import { OAuth2Client } from "google-auth-library";
import nicknameMaker from "../constants/nickname";
import User from "../db/schema/user";
import { setToken } from "../middlewares/jwt";
import { RequestHandler } from "express";

const { ID_GOOGLE: client_id, PW_GOOGLE: client_secret, URI_GOOGLE: redirect_uri } = process.env;

const googleCode = async (code: string) => {
  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id,
      client_secret,
      redirect_uri,
      // 팝업은 프론트에서 종료(redirect)되므로, 프론트 주소를 넣는다.
      grant_type: "authorization_code",
    }),
  });
  const { access_token } = await token.json();
  const googleUser = await fetch(`https://www.googleapis.com/userinfo/v2/me?access_token=${access_token}`);
  const payload = await googleUser.json();
  return payload.id;
};

const googleCredential = async (credential: string) => {
  const client = new OAuth2Client(client_id);
  const ticket = await client.verifyIdToken({
    idToken: credential,
  });
  const payload = ticket.getPayload();
  return payload?.sub ?? "";
};

export const googleStrategy: RequestHandler = async (req, res, next) => {
  try {
    let sub = "";
    let nickname;
    let id;

    const { code, credential } = req.body;
    if (code) {
      sub = await googleCode(code);
    }
    if (credential) {
      sub = await googleCredential(credential);
    }
    if (!sub) {
      res.status(400).send({ code: 400, error: "잘못된 로그인입니다." });
      return;
    }

    const currentUser = await User.findOne({ sub });
    if (!currentUser) {
      const newUser = await User.create({
        sub,
        nickname: nicknameMaker(sub),
        provider: "google",
      });
      id = newUser.id;
      nickname = newUser.nickname;
    } else {
      id = currentUser.id;
      nickname = currentUser.nickname;
    }
    const accessToken = setToken({ id }, "10m");
    const refreshToken = setToken({ id }, "1d");
    res.status(200).send({ accessToken, refreshToken, nickname });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
};
