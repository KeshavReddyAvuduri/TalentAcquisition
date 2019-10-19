Ext.define('JobOpenings.view.preferences.PreferencesGridView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.preferencesgrid',
    plugins: 'gridfilters',
    cls: 'karmalist-cls',
    style:'border:1px solid #efe8e8; background: black;',
    bind:{
      store:'{preferncesStore}'
    },
    columns:[
        { text: 'Name', 
          flex:0.3,
          dataIndex: 'name'
        },
        { text: 'Description', 
          flex:0.4,
          dataIndex: 'description'
       },
        { 
          text: 'Action', 
          flex:0.1,
          xtype:'actioncolumn',
          align:'center',
          items:[{
            iconCls: 'x-fa fa-trash',
            tooltip: 'Delete',
            handler: function(grid, rowIndex, colIndex) {
              var gridStore = grid.getStore('preferncesStore'),
                  rec = gridStore.getAt(rowIndex),
                  params;
              params = {
                tablename:gridStore.proxy.extraParams.tablename,
                id: rec.data.id,
                name:rec.data.name
              };
              var url = '/preference/preferencedata';
              Ext.Ajax.request({
                  url: url,
                  method: 'DELETE',
                  params: params,
                  success: function(resp, b) {
                      gridStore.removeAt(rowIndex);
                      gridStore.reload();
                      Ext.getBody().unmask();
                  },
                  failure: function(resp, b) {
                      Ext.getBody().unmask();
                  }
              });
          }
          }] 
        }],
        listeners: {
          rowdblclick: 'onGridRowClick',
        
      }
});