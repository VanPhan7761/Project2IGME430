const controllers = require("./controllers");
const mid = require("./middleware");
const file = require("./controllers/files.js");

const router = (app) => {
  app.get("/getToken", mid.requiresSecure, controllers.Account.getToken);
  app.get("/getAssets", mid.requiresLogin, controllers.Asset.getAssets);

  app.get("/getAllAssets", mid.requiresLogin, controllers.Asset.getAllAssets);

  app.get(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );

  app.post(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.login
  ); // debugging (login)
  app.post(
    "/signup",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.signup
  );

  app.get("/logout", mid.requiresLogin, controllers.Account.logout);

  // app.get('/store', mid.requiresLogin, controllers.Account.storePage);

  app.get("/maker", mid.requiresLogin, controllers.Asset.makerPage);
  app.post("/maker", mid.requiresLogin, controllers.Asset.makeAsset);

  // upload files to database
  app.post("/upload", file.uploadFile);

  // return the file back to the user
  app.get("/retrieve", file.retrieveFile);

  app.get(
    "/",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );

  app.get("*", mid.requiresLogin, controllers.Asset.makerPage);
};

module.exports = router;
