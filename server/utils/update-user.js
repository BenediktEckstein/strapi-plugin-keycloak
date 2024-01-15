// const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const keycloakRole = require("./keycloak-role");

// Create user
module.exports = async (jwt, strapi, user) => {

  const roleId = await keycloakRole(jwt, strapi)

  if (user.role.id != roleId) {
    return await strapi.entityService.update('plugin::users-permissions.user', user.id, { role: roleId })
    // let updatedUser = await getService("user").edit(user.id, { role: roleId })
    // return updatedUser;
  }
  return user;

};
