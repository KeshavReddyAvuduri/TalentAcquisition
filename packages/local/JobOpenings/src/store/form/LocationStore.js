Ext.define('JobOpenings.store.form.LocationStore', {
    extend: 'Ext.data.Store',

    alias: 'store.locationstore',

    requires: [
        'JobOpenings.model.form.LocationModel'
    ],
    model: 'JobOpenings.model.form.LocationModel',
    autoLoad: false,
    storeId: 'joblocationstore',

    proxy: {
        type: 'ajax',
        url: Api.URL.joblocation.READ,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});

