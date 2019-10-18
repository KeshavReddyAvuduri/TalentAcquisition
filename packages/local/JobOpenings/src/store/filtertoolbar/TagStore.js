Ext.define('JobOpenings.store.filtertoolbar.TagStore', {
    extend: 'Ext.data.Store',
    alias: 'store.tagstore',
    storeId: 'location',
    model: 'JobOpenings.model.filtertoolbar.TagModel',
    data:{items:[{
        loc_id:1,loc_name:'test'
    }]},
    proxy:{
        type: 'ajax',
       // url: 'resources/data/jobopenings/filterstoolbar/filterbylocation.json',
      // url:'/jobopeningrequest/getLocationData',
        reader:{
            type: 'json',
            rootProperty: 'items'
        }
    }
});