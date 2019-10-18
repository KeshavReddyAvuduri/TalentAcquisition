Ext.define('JobsModule.store.jobopenings.JobOpenings', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopenings',

    //storeId: 'jobopenings',

    requires: [
        'JobsModule.model.jobopenings.JobOpenings'
    ],

    model: 'JobsModule.model.jobopenings.JobOpenings',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: Api.URL.currentjobopenings.READ,
                reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});