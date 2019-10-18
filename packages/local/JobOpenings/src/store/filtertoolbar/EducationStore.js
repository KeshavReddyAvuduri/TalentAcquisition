Ext.define('JobOpenings.store.filtertoolbar.EducationStore', {
    extend: 'Ext.data.Store',
    alias: 'store.educationstore',
    storeId: 'educationStore',
    model: 'JobOpenings.model.filtertoolbar.EducationModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:Api.URL.jobapplication.getJobeducation,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 