Ext.define('JobOpenings.view.applicationenquiry.ApplicationViewForm', {
    extend: 'Ext.form.Panel',
    // xtype:'applicationviewform',
    alias: 'widget.applicationviewform',
    cls: 'enquiry-cls',
    reference: 'applicationform',
    margin: '20 0',
    title: 'Application Details',
    //cls:'appenq-title',
    //    dockedItems: [{
    //     xtype: 'toolbar',
    //     cls: 'tooltip-cls',
    //     dock: 'bottom',
    //     items: [{
    //         xtype: 'button',
    //         scale: 'medium',
    //         iconCls: 'goalsbackbtn-cls',
    //         cls: 'jobback-btn-cls',
    //         style: {
    //             border: 0,
    //         }

    //     }, {
    //         xtype: 'label',
    //         html: 'Create New Job Opening',
    //         cls: 'backlabel-cls'        
    //     }]
    // }],
    items: [{
        xtype: 'form',
        // title: 'Application Details',
        cls: 'job-header',
        margin: '30 185',
        width:657,
        style:'border:1px solid #DEDEDE; padding-top: 15px;',
        reference: 'jobopenform',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'center'
        },
        border: false,
        buttonAlign: 'center',
        defaults: {
            width: '60%',
            labelAlign: 'center',
            labelWidth: 180,
            left:120,
            padding: 5,
            labelStyle: 'font-size:16px;'
        },
        items: [{
            xtype: 'combobox',
            reference: 'myCombo',
            name: 'idtype',
            fieldLabel: 'Identification Type',
            cls: 'enquiry-cls1',
            emptyText: 'Identification Type',
            //value:'Mobile Number',
            emptyCls: 'referrals-empty-text',
            store: Ext.create("JobOpenings.store.filtertoolbar.IdTypeCombo",{autoLoad:true}),
            // displayField: 'type',
            // valueField: 'type',  
            // displayField: 'company',
            // valueField: 'id',
            displayField: "id_type",
            editable: false,
            valueField: "ddo_jobidentificationtype_id",
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        }, {
            xtype: 'textfield',
            name: 'idnumber', // same as field name in the table
            required: true,
            maskRe: /^[0-9]*$/,
            minLength: 10,
            maxLength: 10,
            enforceMaxLength: true,
            reference: 'jobtitleref',
            fieldLabel: 'Identification Number',
            emptyText: 'Mobile Number',
            emptyCls: 'referrals-empty-text',
            allowBlank: false, // requires a non-empty value
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        }],
        buttons: [{
            text: 'Verify',
            cls: 'verifybtn-cls',
            margin: '0 0',
            width: '120px',
            formBind: true,
            listeners: {
                click: 'onReadClick'
            }
        }]
     },
     {
        xtype:'label',
        hidden:false,
        reference:'selectType',
        html:'Please select the identification type',
        cls: 'textmsglabel-cls'
    },
     {
         xtype:'label',
         hidden:true,
         reference:'enquiryDetails',
         html:'Application found for the given identification details',
         cls: 'textmsglabel-cls'
     },
     {
        xtype:'label',
        hidden:true,
        reference:'enquiryDetailsNotfoundref',
        html:'No matching application found for the given identification details!',
        cls: 'textmsglabelnodata-cls'
    },
    {
        xtype:'gridpanel',    
        height:100,
        width:657,
        cls: 'karmalist-cls enquiry-cls',
        style:'margin-left: 185px;border:1px solid #efe8e8; background: black;',
        bind: {
            store: '{gridstore}'
        },           
        columns:[{
            text: 'Name',
            dataIndex:'name',
            flex:0.3
        },{
            text:'Email ID',
            dataIndex:'email',
            flex:0.4
        }]
    }
    // ,
    //  {
    //     xtype: 'displayfield',
    //     hidden:true,
    //     // reference:'displayEnquiryName',
    //     // beforeLabelTextTpl:'Already Applicant Details are Existing',
    //     fieldLabel: 'Name',
    //     // name: 'home_score',
    //     //value: '10',
    //     cls: 'msglabel-cls'
    // },
    // {
    //     xtype: 'displayfield',
    //     hidden:true,
    //     // reference:'displayEnquiryEmail',
    //     fieldLabel: 'Email ID',
    //     // name: 'home_score',
    //     //value: '10',
    //     cls: 'msglabel-cls'
    // }
]
});