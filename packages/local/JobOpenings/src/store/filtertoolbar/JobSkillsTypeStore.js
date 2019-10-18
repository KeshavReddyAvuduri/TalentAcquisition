Ext.define('JobOpenings.store.filtertoolbar.JobSkillsTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.jobskillstypestore',
    storeId: 'jobSkillsStore',
    model: 'JobOpenings.model.filtertoolbar.JobSkillsTypeStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:Api.URL.jobskills.READ,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 