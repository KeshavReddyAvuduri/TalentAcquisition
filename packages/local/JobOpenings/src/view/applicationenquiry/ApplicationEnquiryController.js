Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiryController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.applicationenquirycontroller',
   onReadClick: function (sender, record) {
     //  var view = this.getReferences().listview;
     // viewId = view.getId();
      var view = this.getView(),
          form = view.down('form').getForm(),
          values = form.getValues();
      var params = {
        ddo_jobidentificationtype_id:values.idtype,
        identification_num:values.idnumber
  };
  var url = Api.URL.jobapplication.getIdDetails;
  var method = 'GET';
  Ext.Ajax.request({
    url: url,
    method: method,
    scope: this,
    params: params,
           success: function(response, options) {
              var resp = Ext.decode(response.responseText);
              //   Ext.Msg.alert('ID Details', 'Application found for the given identification details!',resp);
              //  form.reset();

                var store =this.getStore('gridstore');
                var data={
                    name:resp.data[0].lastname +" "+ resp.data[0].firstname,
                    email:resp.data[0].emailid
                }
                store.removeAll();
                store.add(data);
                //form.reset();
             //var refs = this.getReferences('displayEnquiryName').setValue(resp.data[0].lastname +"&nbsp"+ resp.data[0].firstname);
                Ext.ComponentQuery.query('[reference = enquiryDetails]')[0].setHidden(false);
                Ext.ComponentQuery.query('[reference = enquiryDetailsNotfoundref]')[0].hide();
                Ext.ComponentQuery.query('[reference = selectType]')[0].hide();
              //   Ext.ComponentQuery.query('[reference = displayEnquiryName]')[0].show().setValue(resp.data[0].lastname +"&nbsp"+ resp.data[0].firstname);
              //   Ext.ComponentQuery.query('[reference = displayEnquiryEmail]')[0].show().setValue(resp.data[0].emailid);
            },
     failure: function(response, options) {
              //   Ext.Msg.alert('ID Details', 'No matching application found for the given identification details!');
                var store =this.getStore('gridstore');
                var data = { name: '--', email: '--' };
                store.removeAll();
                store.add(data);
                Ext.ComponentQuery.query('[reference = enquiryDetailsNotfoundref]')[0].setHidden(false);
                Ext.ComponentQuery.query('[reference = enquiryDetails]')[0].hide();
                Ext.ComponentQuery.query('[reference = selectType]')[0].hide();
              //   Ext.ComponentQuery.query('[reference = displayEnquiryName]')[0].hide();
              //   Ext.ComponentQuery.query('[reference = displayEnquiryEmail]')[0].hide();
            }
  });
      
         
  }

}); 