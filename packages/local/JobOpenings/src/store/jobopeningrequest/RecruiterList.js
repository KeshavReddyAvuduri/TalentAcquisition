Ext.define('JobOpenings.store.jobopeningrequest.RecruiterList', {
    extend: 'Ext.data.Store',
    alias: 'store.recruiterlist',

    requires: [
        'JobOpenings.model.jobopeningrequest.RecruiterList'
    ],

    model: 'JobOpenings.model.jobopeningrequest.RecruiterList',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url:Api.URL.jobrecruiter.READ,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});