Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiry', {
    extend: 'Ext.panel.Panel',
    xtype: 'applicationenquiry',
    requires:[
        'JobOpenings.view.applicationenquiry.ApplicationEnquiryController',
        'JobOpenings.view.applicationenquiry.ApplicationEnquiryModel',
        'JobOpenings.view.applicationenquiry.ApplicationViewForm'

    ],
    layout: {
        type: 'card'
    },
    controller: 'applicationenquirycontroller',
    viewModel: {
        type: 'enquiryviewmodel'
    },
    margin: '10 0 0 10',
    reference: 'applicationenquiryreference',
   
    items:[{
        xtype:"applicationviewform"
    }]
 
});