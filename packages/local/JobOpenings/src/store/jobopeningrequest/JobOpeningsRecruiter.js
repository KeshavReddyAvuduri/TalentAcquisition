Ext.define('JobOpenings.store.jobopeningrequest.JobOpeningsRecruiter', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopeningsrecruiter',
    storeId: 'jobopeningsrecruiter',

    requires: [
        'JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel'
    ],

    model: 'JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url:Api.URL.jobrecruiter.READ,
        // url: '/jobopeningrequest/getRecruitersList',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});