Ext.define('JobOpenings.view.preferences.PreferencesToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.preferencestoolbar',
    cls: 'rule-tb-cls',
    items: [{
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        text: 'Add New',
        iconCls: 'x-fa fa-plus',
        margin: 0,
        cls: 'rule-add-btn',
        listeners: {
            click: 'onAddNewClick'
        }
    }]
});