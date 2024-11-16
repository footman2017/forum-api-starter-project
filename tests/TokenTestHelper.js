/* istanbul ignore file */
class TokenTestHelper {
  constructor(server) {
    this._server = server;
  }

  async registerUser(payload) {
    const response = await this._server.inject({
      method: "POST",
      url: "/users",
      payload,
    });
    return response.payload;
  }

  async loginUser(payload) {
    const response = await this._server.inject({
      method: "POST",
      url: "/authentications",
      payload,
    });
    return response.payload;
  }

  async getCredentials(
    payload = {
      username: "user1",
      password: "password",
      fullname: "user",
    }
  ) {
    const userId = JSON.parse(await this.registerUser(payload)).data.addedUser.id;
    const accessToken = JSON.parse(
      await this.loginUser({
        username: payload.username,
        password: payload.password,
      })
    ).data.accessToken;

    return { userId, accessToken };
  }
}

module.exports = TokenTestHelper;
