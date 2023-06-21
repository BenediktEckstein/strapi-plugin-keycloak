const { getService } = require("@strapi/plugin-users-permissions/server/utils");

const keycloakRole = require("./keycloak-role");


// Create user
module.exports = async (jwt, strapi) => {

  const roleId = await keycloakRole(jwt, strapi)

  return await getService("user").add({
    email: jwt.email,
    confirmed: jwt.email_verified,
    blocked: false,
    username: jwt.name,
    role: roleId,
  });
};
