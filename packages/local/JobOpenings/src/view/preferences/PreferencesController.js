Ext.define('JobOpenings.view.preferences.PreferencesController',{
    extend: 'Ext.app.ViewController',
    alias:'controller.preferencescontroller',
    onAddNewClick:function(btn, e, eOpts) {
        var view = this.getView();
        var preferencesWindow = Ext.ComponentQuery.query('preferenceswindow')[0] || Ext.create('JobOpenings.view.preferences.PreferencesWindow'),
            form = preferencesWindow.down('form');
            this.onFormLoadTrue(form);
        form.reset();
        preferencesWindow.show();
        preferencesWindow.edit = false;
    },
    onFormLoadTrue: function(form) {
        var formValues = form.getValues();
         var items = form.getForm().getFields().items,
            i = 0,
            len = items.length;
        for (; i < len; i++) {
            var formField = items[i];
            formField.setValue('');
            if (formField.mixins && formField.mixins.field && typeof formField.mixins.field['initValue'] == 'function') {
                formField.mixins.field.initValue.apply(formField);
                formField.wasDirty = false;
            }
        }
       
    },
    onGridRowClick: function(row, record, tr, rowIndex, e, eOpts) {
        var preferencesWindow = Ext.ComponentQuery.query('preferenceswindow')[0] || Ext.create('JobOpenings.view.preferences.PreferencesWindow'),
            form = preferencesWindow.down('form');

        this.onFormLoadDirtyFalse(form, record);
        form.reset();
        form.loadRecord(record);

        preferencesWindow.show();
        preferencesWindow.edit = true;
    },
    onFormLoadDirtyFalse: function(form, record) {
        form.items.items.forEach(function(rec) {
            rec.originalValue = record.get(rec.name);
        });
    },
    onWindowOutsideTap: function(event, target) {
        var view = this;
        Utility.onSetUpWinOutterTap(event, target, view);
    },
    onFormCancelClick: function(btn, e, eOpts) {
        var preferencesWindow, form;

        preferencesWindow = btn.up('window');
        form = preferencesWindow.down('form');

        form.reset();
        preferencesWindow.close();
    },
    onFormSaveClick: function(btn, e, eOpts) {
                var gridStore, preferencesWindow,form,formRec,params,name,valueMatch,editRec;
                gridStore = Ext.ComponentQuery.query('preferencesgrid')[0].getStore();
                preferencesWindow = btn.up('window');
                form = preferencesWindow.down('form');
                formRec = form.getValues();
                name = Ext.String.trim(formRec.name); 
                valueMatch = gridStore.findRecord('name',name,0,false,false,true);
                if (preferencesWindow.edit) {
                    editRec = gridStore.findRecord('id', formRec.id);
        
                    if (valueMatch && editRec && editRec.get('name').toLowerCase() == valueMatch.get('name').toLowerCase()) {
                        valueMatch = null;
                    }
                }
                if (!valueMatch) {
                    if (form.isDirty()) {
                        if (preferencesWindow.edit) {
                            form.updateRecord();
                            params = {
                                id: formRec.id,
                                name: formRec.name,
                                description: formRec.description, 
                                tablename:gridStore.proxy.extraParams.tablename
                            };
                            Ext.Ajax.request({
                                url: Api.URL.preferenceData.UPDATE,
                                method: 'PUT',
                                jsonData: params,
                                success: function(resp, b) {
                                    gridStore.load();
                                    Ext.getBody().unmask();
                                },
                                failure: function(resp, b) {
                                    Ext.getBody().unmask();
                                }
                            });
                        } else {
                            formRec.tablename = gridStore.proxy.extraParams.tablename;
                            gridStore.add(formRec);
                            gridStore.sync({ 
                                callback: function() {
                                    gridStore.load();
                                }
                            });
                        }
                        form.reset();
                        preferencesWindow.close();
                    } else {
                        form.reset();
                        preferencesWindow.close();
                    }
                } else {
                    Ext.Msg.alert('Warning', 'Record is existing!');
                }
    },
    onPreferencesClick:function(ele, record, item, index, e, eOpts ){
                var store = this.getStore('preferncesStore');
                store.getProxy().extraParams = {
                    tablename: record.data.tablename
                };
                store.load();
    }
});