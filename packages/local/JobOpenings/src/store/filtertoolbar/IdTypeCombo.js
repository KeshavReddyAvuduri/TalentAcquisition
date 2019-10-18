Ext.define('JobOpenings.store.filtertoolbar.IdTypeCombo', {
    extend: 'Ext.data.Store',
    alias: 'store.idtypecombo',
    storeId: 'idtypecombo',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:'resources/data/jobapplications/idtypes.json',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 