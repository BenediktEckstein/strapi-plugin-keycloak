const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const keycloakRole = require("./keycloak-role");

// Create user
module.exports = async (jwt, strapi, user) => {

  const roleId = await keycloakRole(jwt, strapi)

  if (user.role.id != roleId) {
    let updatedUser = await getService("user").edit(user.id, { role: roleId })
    return updatedUser;
  }
  return user;

};
