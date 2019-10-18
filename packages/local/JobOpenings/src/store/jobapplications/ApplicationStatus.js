Ext.define('JobOpenings.store.jobapplications.ApplicationStatus', {
    extend: 'Ext.data.Store',
    alias: 'store.applicationstatus',   

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url:'resources/data/jobapplications/jobapplicationstatus.json',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});