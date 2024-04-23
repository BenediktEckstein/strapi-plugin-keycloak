const { roleMappingPrefix, roleMapping } = strapi.config.keycloak;

// Keycloak role mapping
module.exports = async (jwt, strapi) => {
    const permissionsRole = strapi.query("api::user-rl.user-rl")

    if (roleMapping) {
        const allRoles = await permissionsRole.findMany({});

        let jwtMappedRoles = allRoles.filter((r) => {
            if (roleMappingPrefix) {
                return jwt.realm_access.roles.includes(roleMappingPrefix + r.name)

            } else {
                return jwt.realm_access.roles.includes(r.name)
            }
        });

        return jwtMappedRoles.map((r) => r.id);
    }

    return [];

};
