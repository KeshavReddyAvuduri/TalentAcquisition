Ext.define('JobsModule.store.jobopenings.JobRecruiter', {
    extend: 'Ext.data.Store',
    alias: 'store.jobrecruiter',

    requires: [
        'JobsModule.model.jobopenings.JobRecruitersModel'
    ],

    model: 'JobsModule.model.jobopenings.JobRecruitersModel',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        // url:  Api.URL.jobrecruiter.READ,
        url:'http://192.168.1.16:3400/jobopeningrequest/jobrecruiters',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});