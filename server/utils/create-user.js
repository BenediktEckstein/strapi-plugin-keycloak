// const { t } = require("@strapi/plugin-users-permissions");

const keycloakRole = require("./keycloak-role");


// Create user
module.exports = async (jwt, strapi) => {

  const roleId = await keycloakRole(jwt, strapi)
  return await strapi.entityService.create('plugin::users-permissions.user', {
    email: jwt.email,
    confirmed: jwt.email_verified,
    blocked: false,
    username: jwt.name,
    role: roleId,
  });

  // return await getService("user").add();
};
