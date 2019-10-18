Ext.define('JobOpenings.view.preferences.PreferencesTypesListView', {
    extend: 'Ext.container.Container',
    xtype: 'preferencestypeslistView',
    requires: [
        'JobOpenings.view.preferences.PreferencesTypesListModel'
    ],
    viewModel: {
      type: 'preferencestypeslistmodel'
    },
    items: [{
      xtype: 'dataview',
      bind: {
        store: '{preferencestypelist}'
      },
      listeners:{
        afterrender:function(){
          Ext.ComponentQuery.query('preferencestypeslistView')[0].getViewModel().getStore('preferencestypelist').load();
        }
      },
      
      itemTpl:'<div class="preferenceslist">{name}</div>',
      itemSelector: 'div.preferenceslist',
      listeners: {
        itemclick: 'onPreferencesClick'
      }
    }]
    
  });
  