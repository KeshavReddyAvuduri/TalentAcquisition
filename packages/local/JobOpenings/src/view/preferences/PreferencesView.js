Ext.define('JobOpenings.view.preferences.PreferencesView', {
    extend: 'Ext.panel.Panel',
    xtype: 'preferencesview',
    requires:[
        'JobOpenings.view.preferences.PreferencesGridView',
        'JobOpenings.view.preferences.PreferencesTypesListView',
        'JobOpenings.view.preferences.PreferencesGridModel',
        'JobOpenings.view.preferences.PreferencesController',
        'JobOpenings.view.preferences.PreferencesToolbar'
    ],
    margin: 20,
    cls: 'filter-window-color',
    viewModel: {
        type: 'preferencesgridmodel'
    },
    controller:'preferencescontroller',
    layout:{
        type:'hbox',
        width:'100%'
    },
        tbar:[{
            xtype:'preferencestoolbar',
            cls: 'wallet-toolbar-cls',
             width: '100%',
             height: 70,
             html: '<h3>Preferences</h3>'
        }],
      

    items:[{
          xtype:'preferencestypeslistView',
          flex:0.7
      },
      {
        xtype:'tbspacer',
        width: 20
      },{
          xtype:'preferencesgrid',
          flex:2
      },{
          xtype:'tbspacer',
          width:10
      }]
    
});