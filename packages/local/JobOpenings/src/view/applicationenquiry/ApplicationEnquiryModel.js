Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.enquiryviewmodel',
  //  requires:['JobOpenings.store.applicationenquiry.ApplicationIdType'],
  // stores: {
  //       types: {
  //         model:'Ext.data.Model',
  //         fileds:['name','email'],
  //           autoLoad: false,
  //           data:{
  //             'name':'Mohan',
  //             'email':'banoth@gmail.com'

  //           }

  //       }
  //   }

    stores:{
           gridstore:{
           autoLoad: false,
                fields:['name','email'],
            data:[
        	    { name: '--', email: '--' }        	    
            ]
          }
         
        }

});
