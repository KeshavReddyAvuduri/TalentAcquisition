Ext.define('JobOpenings.view.preferences.PreferencesGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.preferencesgridmodel',
  stores: {
    preferncesStore: {
        fields:['name','description'],
            autoLoad: true,
            proxy:{
                type:'ajax',
                extraParams:{
                    tablename:'ddo_jobtype'
                },
                api: {
                    read    :Api.URL.preferenceData.READ,
                    create  : Api.URL.preferenceData.CREATE,
                    update  : Api.URL.preferenceData.UPDATE,
                    destroy : Api.URL.preferenceData.DELETE
                },
                reader:{
                    type: 'json',
                    rootProperty:'data'
                },
                actionMethods: {
                    read: 'GET',
                    create: 'POST',
                    update: 'PUT',
                    destroy: 'DELETE'
                }
            }
        }
    }
});
