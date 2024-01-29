// const { t } = require("@strapi/plugin-users-permissions");

const keycloakRole = require("./keycloak-role");


// Create user
module.exports = async (jwt, strapi) => {

  const roleId = await keycloakRole(jwt, strapi)
  return await strapi.plugins['users-permissions'].services.user.add({
    email: jwt.email,
    confirmed: jwt.email_verified,
    password: Math.random().toString(36).slice(2),
    blocked: false,
    provider: 'local',
    created_by: 1, //user admin id
    updated_by: 1, //user admin id
    username: jwt.preferred_username,
    role: roleId,
  });

  // return await getService("user").add();
};
