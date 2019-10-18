Ext.define('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus', {
    extend: 'Ext.data.Store',
    alias: 'store.filterbyapplicationstatus',
    storeId: 'applicationStatus',
    model: 'JobOpenings.model.filtertoolbar.FilterbyApplicationStatus',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:Api.URL.jobAppinterViewAppStatus.READ,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 