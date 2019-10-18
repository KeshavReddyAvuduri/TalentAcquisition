Ext.define('JobOpenings.view.referrals.ReferralsViewmodel', {
    extend:'Ext.app.ViewModel',
    alias:'viewmodel.referralviewmodel',
    data: {
        locationName: '',
        resumePath2:'Choose File'
    },
    stores: {
        referralstore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
              //  url: Api.URL.joblocation.READ,
              url:'jobapplication',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        referralcombostore:{
            autoLoad:true,
            proxy:{
                type:'ajax',
                url:'resources/data/jobapplications/referralcombo.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        }

    }
});