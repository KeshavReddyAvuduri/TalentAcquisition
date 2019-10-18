Ext.define('JobOpenings.store.filtertoolbar.RatingStore', {
    extend: 'Ext.data.Store',
    alias: 'store.ratingstore',
    storeId: 'ratingStore',
    model: 'JobOpenings.model.filtertoolbar.RatingModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url:Api.URL.jobappinterview.getInterviewRating,
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
}); 