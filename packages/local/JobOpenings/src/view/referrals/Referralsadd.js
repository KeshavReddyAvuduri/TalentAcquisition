Ext.define('JobOpenings.view.referrals.Referralsadd', {
    extend: 'Ext.form.Panel',
    alias: 'widget.referralsadd',
    requires: [
        'JobOpenings.view.referrals.ReferralsViewmodel'
    ],
    viewModel: {
        type: 'referralviewmodel'
    },
    listeners:{
        afterrender:function(){
          this.getViewModel().getStore('referralcombostore').load();
        }
      },
    cls: 'form-cls apply-form',
    defaults: {
        width: '50%',
        labelAlign: 'right',
        labelWidth: 220,
        padding: 5,
        labelStyle: 'font-size:16px;'
    },
    reference: 'referralsForm',
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    title: 'Employee Referral Form',
    buttonAlign: 'center',
    items: [{
        xtype: 'hiddenfield',
        name: 'ddo_referral'
    }, {
        xtype: 'hiddenfield',
        name: 'ddo_jobopening_id'
    }, {
        xtype: 'textfield',
        name: 'firstname',
        fieldLabel: 'First Name:',
        emptyCls: 'referrals-empty-text',
        maskRe: /^[A-Za-z]*$/,
        emptyText: 'Name',
        allowBlank: false, // requires a non-empty value
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'textfield',
        name: 'lastname',
        fieldLabel: 'Last Name:',
        emptyCls: 'referrals-empty-text',
        maskRe: /^[A-Za-z]*$/,
        emptyText: 'Last Name',
        allowBlank: false, // requires a non-empty value,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'textfield',
        name: 'email',
        fieldLabel: 'Email',
        emptyCls: 'referrals-empty-text',
        emptyText: 'Email ID',
        required: true,
        allowBlank: false, // requires a non-empty value
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
        vtype: 'email'  // requires value to be a valid email address format
    }, {
        xtype: 'textfield',
        name: 'phone',
        emptyText: 'Phone',
        fieldLabel: 'Phone:',
        emptyCls: 'referrals-empty-text',
        maskRe: /^[0-9]*$/,
        required: true,
        minLength: 10,
        maxLength: 10,
        enforceMaxLength: true,
        allowBlank: false, // requires a non-empty value
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
    }, {
        xtype: 'combobox',
        name: 'combo',
        reference: 'referralcombo',
        bind: {
            store: '{referralcombostore}'
        },
        queryMode: 'local',
        displayField: 'name',
        emptyText: 'Eg:friend',
        editable: false,
        tpl: Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item" style="text-align:center;">{name}</li>',
            '</tpl></ul>'
        ),
        // template for the content inside text field
        displayTpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '{name}',
            '</tpl>'
        ),
        emptyCls: 'referrals-empty-text',
        fieldLabel: 'How do you know this person:'
    }, {
        xtype: 'textfield',
        name: 'recommendation',
        emptyCls: 'referrals-empty-text',
        fieldLabel: 'Recommendation:',
        emptyText: 'Enter why WTT is good for Him/Her'
    }, {
        // xtype: 'fieldcontainer',
        // defaults: {
        //     width: '60%',
        //     labelAlign: 'right',
        //     labelWidth: 220,
        //     padding: 5,
        //     labelStyle: 'font-size:16px;'
        // },
        // items: [{
        anchor: '100%',
        xtype: 'fileuploadfield',
        opType: 'upload',
        name: 'appResume',
        iconCls: 'upload-cls',
        reference: 'referralfileuploadref',
        buttonOnly: true,
        listeners: {
            change: 'buttonOnlyChange'
        },
        bind: {
            value: '{resumePath}'
        },
        buttonConfig: {
            cls: 'upload-btn',
            width: "100%",
            iconCls: 'x-fa fa-upload',
            iconAlign: 'right',
            reference: 'referraluploadbtn',
            //text: 'Choose File',
            name: 'uploadid',
            id: 'uploadid',
            bind: {
                text: '{resumePath2}'
            }
        },
        fieldLabel: "Upload CV:"
        //}]
    }, {
        xtype: 'fieldcontainer',
        width: 550,
        items: [{
            xtype: 'label',
            text: 'Upload CV:',
            reference: 'referraluploadlabelref',
            hidden: true,
            cls: 'uploadhiddenlabel-cls referrallabelCls',
            tpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
        }, {
            xtype: 'button',
            width: 300,
            cls: 'uploadeditbtn-cls',
            name: 'uploadResumeHiddenBtn',
            reference: 'referraluploadhiddenbtnref',
            iconCls: 'x-fa fa-times',
            iconAlign: 'right',
            hidden: true,
            //         //text :'File',
            bind: {
                //             //hidden:'{uploadBtnForEditShow}',
                text: '{resumePath2}'
            },
            listeners: {
                btnIconEl: {
                    click: function (btn) {
                        var referralFileUpload = Ext.ComponentQuery.query('[reference = referralfileuploadref]')[0],
                            referralUploadBtn = Ext.ComponentQuery.query('[reference = referraluploadbtn]')[0];
                        referralFileUpload.show();
                        referralUploadBtn.setText("Choose File");
                        referralFileUpload.fileInputEl.dom.value = "";
                        Ext.ComponentQuery.query('[reference = referraluploadlabelref]')[0].hide();
                        Ext.ComponentQuery.query('[reference = referraluploadhiddenbtnref]')[0].hide();
                    }
                }
            }
        }]
    }
    ],

    bbar: {
        cls: 'jobform-cls',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'center'
        },
        items: [{
            xtype: 'button',
            text: 'Refer',
            width: 200,
            disabledCls: 'disable-btn',
            formBind: true,
            cls: 'referral-margin',
            listeners: {
                click: 'onReferClick'
            }
        }, {
            xtype: 'button',
            text: 'Cancel',
            cls: ['require-btn', 'referral-click'],
            handler: 'onCancelBtnClick'
        }]
    }
   
});