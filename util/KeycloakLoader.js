

Ext.define('JobsModule.util.KeycloakLoader', {
    extend: "Ext.util.Observable",
    singleton: true,
    alternateClassName: ['KeycloakLoader'],
    keycloak : null,

    initialize : function () {
        
        var me = this,
            keycloak;
        keycloak = Keycloak('./resources/keycloak.json');
        me.keycloak = keycloak;
    },

    getKeycloak: function () {
        return this.keycloak;
    }
});
