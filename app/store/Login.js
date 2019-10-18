Ext.define('JobsModule.store.Login', {
    extend:'Ext.data.Store',
    alias:'store.login',
    // storeId:'loginstore',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'login',
            proxy: {
                type: 'ajax',
                url: Api.URL.login.READ,

                 actionMethods: {
                    read: 'POST'
                },
                reader: {
                    type: 'json',
                    rootProperty : "data"
                }
            },
            listeners: {
                beforeload: function(store, operation, options) {
                    store.getProxy().extraParams = {
                        "email" : operation.email
                    };
                }
            }
        }, cfg)]);
    }
});
