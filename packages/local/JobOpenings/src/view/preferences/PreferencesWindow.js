Ext.define('JobOpenings.view.preferences.PreferencesWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.preferenceswindow',
    modal: true,
    resizable: false,
    cls: 'rule-window-cls',
    width: 600,
    closable: false,
    closeAction: 'hide',
    requires: [
        'JobOpenings.view.preferences.PreferencesGridModel',
        'JobOpenings.view.preferences.PreferencesController'
    ],
    title: 'Preferences',
    controller: 'preferencescontroller',
    viewModel: {
        type: 'preferencesgridmodel'
    },
    initComponent: function() {
        this.callParent(arguments);
        var controller = this.getController();
        Ext.getDoc().on('click', Ext.bind(controller.onWindowOutsideTap, controller));
    },
    destroy: function() {
        var controller = this.getController();
        Ext.getDoc().un('click', Ext.bind(controller.onWindowOutsideTap, controller));
    },
    listeners: {
        show: function(win, opts) {
            win.center();
        }
    },
    width: 600,
    height: 250,
    items: [{
        xtype: 'form',
        bbar: {
            layout: {
                type: 'hbox'
            },
            padding: '25 0 21 0',
            items: [{
                xtype: 'button',
                text: 'Cancel',
                cls: 'karmaform-cancel-btn',
                listeners: {
                    click: 'onFormCancelClick'
                }
            }, {
                xtype: 'button',
                text: 'Save',
                cls: 'karmaform-save-btn',
                formBind: true,
                listeners: {
                    click: 'onFormSaveClick'
                }
            }]
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'id'
        }, {
            xtype: 'textfield',
            allowBlank: false,
            name: 'name',
            emptyText: 'Name',
            required: true,
            cls: 'rule-name-cls'
        },{
            xtype: 'textfield',
            allowBlank: false,
            name: 'description',
            emptyText: 'Description',
            cls: 'rule-name-cls'
        }]
    }]
});