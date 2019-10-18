Ext.define('JobOpenings.view.referrals.ReferralsFormView', {
    extend: 'Ext.form.Panel',
    alias: 'widget.referralsformview',
    requires:[
        'JobOpenings.view.referrals.ReferralsViewmodel'
    ],
    viewModel: {
       type:'referralviewmodel'
    },
    cls: 'form-cls apply-form',
    defaults: {
        width: '50%',
        labelAlign: 'right',
        labelWidth: 220,
        padding: 5,
        labelStyle: 'font-size:16px;'
    },
    reference: 'referralsformviewRef',
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    title: 'Employee Referral Form',
    buttonAlign: 'center',
    items: [{
        xtype: 'textfield',
        name: 'firstnameView',
        fieldLabel: 'First Name:',
        readOnly: true,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'textfield',
        name: 'lastnameView',
        fieldLabel: 'Last Name:',
        readOnly: true,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'textfield',
        name: 'emailView',
        fieldLabel: 'Email',
        readOnly: true,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'textfield',
        name: 'phoneView',
        fieldLabel: 'Phone:',
        readOnly: true,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    },{
        xtype: 'textfield',
        name:'comboView',
        readOnly: true,
        fieldLabel: 'How do you know this person:'
    },{
        xtype: 'textfield',
        name: 'recommendationView',
        readOnly: true,
        fieldLabel: 'Recommendation:'
    }, {
        xtype: 'fieldcontainer',
        defaults: {
            width: '100%',
            labelAlign: 'right',
            labelWidth: 220,
            padding: 5,
            labelStyle: 'font-size:16px;'
        },
        items: [{
            anchor: '100%',
            xtype: 'textfield',
            opType: 'upload',
            name: 'appResumeView',
            iconCls: 'upload-cls',
            readOnly: true,
            fieldLabel: "Upload CV:"
        }]
    }]//,

    // bbar: {
    //     cls: 'jobform-cls',
    //     layout: {
    //         type: 'hbox',
    //         align: 'middle',
    //         pack: 'center'
    //     },
    //     items: [{
    //         xtype: 'button',
    //         text: 'Refer',
    //         width: 200,
    //         disabled:true,
    //         disabledCls:'disable-btn',
    //         //formBind: true,
    //         cls: 'referral-margin'
    //     }, {
    //         xtype: 'button',
    //         text: 'Cancel',
    //         disabled:true,
    //         cls: ['require-btn','referral-click']
    //     }]
    // }
});