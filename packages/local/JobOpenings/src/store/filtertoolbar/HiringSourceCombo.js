Ext.define('JobOpenings.store.filtertoolbar.HiringSourceCombo', {
    extend: 'Ext.data.Store',
    alias: 'store.hiringsourcecombo',
    storeId: 'hiringSourceCombo',
    model: 'JobOpenings.model.filtertoolbar.HiringSourceCombo',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:'jobapplication/hiringsource',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 