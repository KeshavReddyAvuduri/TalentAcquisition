Ext.define('JobOpenings.view.preferences.PreferencesTypesListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.preferencestypeslistmodel',
  stores: {
    preferencestypelist: {
        //   model:'Ext.data.Model',
        //   fileds:['name'],
            autoLoad: true,
            proxy:{
                type:'ajax',
                url:Api.URL.preferenceList.READ,
                reader:{
                    type:'json',
                    rootProperty:'data'
                }
            }
        }
    }
});
