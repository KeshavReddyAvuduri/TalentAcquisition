Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.FilterTagsView', {
    extend: 'Ext.container.Container',

    xtype: 'filtertagsview',

    extend: 'Ext.view.View',
    
    requires: [
        'JobOpenings.store.filtertoolbar.TagStore'
    ],

    loadMask: false,

    overItemCls: 'ddo-interest-over',
    store:'JobOpenings.store.filtertoolbar.TagStore',
    listeners: {
        afterrender: function () {
            this.getStore().load();
        }
   },
    emptyText: '<div class = "ddo-emptytext"></div>',
    tpl: [
        '<tpl>',
        '<div class = "ddo-intertesttpl">',
        '<div class="ddo-interests">{loc_name}</div>',
        '<tpl>',
        '<div class="ddo-interetsts-delete" data-action="deleteLocationFilter"></div>',
        '</tpl>',
        '</div>',
        '</tpl>', {
        }
    ],

    itemSelector: 'div.ddo-intertesttpl'
});