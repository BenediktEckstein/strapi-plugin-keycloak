const { roleMappingPrefix, roleMapping } = strapi.config.keycloak;

// Keycloak role mapping
module.exports = async (jwt, strapi) => {
    const permissionsRole = strapi.query("api::user-rl.user-rl")
    console.log('permissionsRole' , permissionsRole);
    if (roleMapping) {
        const allRoles = await permissionsRole.findMany({});
        console.log('allRoles' , allRoles);
        console.log('jwt.azp' , jwt.azp);
        let jwtRoles = jwt.resource_access[jwt.azp]?.roles || []
        console.log('jwtRoles' , jwtRoles);
        console.log('jwt.realm_access',jwt.realm_access)
        if (roleMappingPrefix && jwt.realm_access.roles) {
            jwtRoles.push(...jwt.realm_access.roles.filter(r => r.startsWith(roleMappingPrefix)).map(r => r.substring(roleMappingPrefix.length)));
        }

        let jwtMappedRoles = allRoles.filter(r => jwtRoles.includes(r.name));
        console.log('jwtMappedRoles' , jwtMappedRoles);
        return jwtMappedRoles.map((r) => r.id);
    }

    return [];

};
