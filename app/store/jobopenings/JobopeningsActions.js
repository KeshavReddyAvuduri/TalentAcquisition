Ext.define('JobsModule.store.jobopenings.JobopeningsActions', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopeningsactions',
storeId:'jobopeningsactions',
    
    autoLoad: true,

    proxy: {
        type: 'ajax',
        url:'resources/data/jobopenings/actionslist.json',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});