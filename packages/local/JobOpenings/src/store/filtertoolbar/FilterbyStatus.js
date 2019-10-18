Ext.define('JobOpenings.store.filtertoolbar.FilterbyStatus', {
    extend: 'Ext.data.Store',
    alias: 'store.filterbyStatus',
    storeId: 'status',
    model: 'JobOpenings.model.filtertoolbar.FilterbyStatus',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: Api.URL.jobstatus.READ,
        // url:'jobopeningrequest/getJobStatusData',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 