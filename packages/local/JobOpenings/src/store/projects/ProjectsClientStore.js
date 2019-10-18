Ext.define('JobOpenings.store.projects.ProjectsClientStore', {
    extend: 'Ext.data.Store',

    alias: 'store.projectsclientstore',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: Api.URL.projectsclientstore.READ,

        reader: {
            type: 'json',
            rootProperty: "data"
        }
    }
});