Ext.define('JobOpenings.store.filtertoolbar.JobOpeningsDateStore', {
    extend: 'Ext.data.Store',
    alias: 'store.jobopeningsdatestore',
    storeId: 'jobopeningsdatestore',
    model: 'JobOpenings.model.filtertoolbar.JobOpeningsDateStore',
    proxy: {
        type: 'ajax',
        url: 'resources/data/jobopenings/filterstoolbar/filterbydate.json',
        reader: {
            type: 'json',
            rootProperty: 'filterbyDate'
        }
    }
});