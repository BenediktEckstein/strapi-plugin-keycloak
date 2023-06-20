const { getService } = require("@strapi/plugin-users-permissions/server/utils");

// Create user
module.exports = async (jwt, strapi) => {
  const pluginStore = await strapi.store({
    type: "plugin",
    name: "users-permissions",
  });
  const settings = await pluginStore.get({
    key: "advanced",
  });

  const permissionsRole = strapi.query("plugin::users-permissions.role")

  const defaultRole = await permissionsRole
    .findOne({ where: { type: settings.default_role } });

  let roleId = defaultRole.id;

  if (strapi.config?.keycloak?.roleMapping) {
    const allRoles = await permissionsRole.findMany({});

    let jwtMappedRoles = allRoles.filter((r) => jwt.realm_access.roles.includes(r.name));
    if (strapi.config?.keycloak?.roleMappingPrefix) jwtMappedRoles = jwtMappedRoles.filter((r) => r.name.startsWith(strapi.config?.keycloak?.roleMappingPrefix));

    if (jwtMappedRoles.length > 1) {
      console.error(
        "More than one role found in keycloak.roleMapping. Please check your keycloak.roleMappingPrefix setting and user Roles. ROLES:".jwtMappedRoles.map((r) => r.name).join(", ")
      );
    } else if (jwtMappedRoles.length == 1) {
      roleId = jwtMappedRoles[0].id;
    }
  }

  return await getService("user").add({
    email: jwt.email,
    confirmed: jwt.email_verified,
    blocked: false,
    username: jwt.name,
    role: roleId,
  });
};
