Ext.define('JobOpenings.store.jobopenings.JobRecruiter', {
    extend: 'Ext.data.Store',
    alias: 'store.jobrecruiter',

    requires: [
        'JobOpenings.model.jobopenings.JobRecruitersModel'
    ],

    model: 'JobOpenings.model.jobopenings.JobRecruitersModel',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url:  Api.URL.jobrecruiter.READ,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});