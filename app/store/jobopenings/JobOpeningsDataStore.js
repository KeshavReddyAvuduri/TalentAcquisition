Ext.define('JobsModule.store.jobopenings.JobOpeningsDataStore', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopeningsdatastore',

    //storeId: 'jobopenings',

    requires: [
        'JobsModule.model.jobopenings.JobOpeningsDataModel'
    ],

    model: 'JobsModule.model.jobopenings.JobOpeningsDataModel',

    autoLoad: true,

    proxy: {
        type: 'ajax',
        url: 'resources/data/jobopenings/jobopeningsdata.json',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});