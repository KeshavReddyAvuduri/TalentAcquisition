Ext.define('JobOpenings.store.jobopenings.JobOpenings', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopenings',

    //storeId: 'jobopenings',

    requires: [
        'JobOpenings.model.jobopenings.JobOpenings'
    ],

    model: 'JobOpenings.model.jobopenings.JobOpenings',

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