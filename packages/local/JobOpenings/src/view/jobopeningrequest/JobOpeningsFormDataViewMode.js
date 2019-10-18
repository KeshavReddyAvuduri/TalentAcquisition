Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode', {
    extend: 'Ext.form.Panel',
    xtype: 'jobOpeningsFormDataViewMode',
    cls: 'form-cls',
    reference: 'jobOpeningsFormDataViewModeRef',
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'tooltip-cls',
        dock: 'top',
        items: [{
            xtype: 'button',
            scale: 'medium',
            iconCls: 'goalsbackbtn-cls',
            cls: 'jobback-btn-cls',
            style: {
                border: 0
            },
            listeners: {
                click: 'onBackClick'
            }
        }, {
            xtype: 'label',
            html: 'Create New Job Opening',
            cls: 'backlabel-cls'        
        }]
    }],
    items: [{
        xtype: 'form',
        title: 'Requirement Details',
        cls: 'job-header',
        reference: 'jobopenformViewRef',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'center'
        },
        border: false,
        buttonAlign: 'center',
        defaults: {
            width: '70%',
            labelAlign: 'right',
            labelWidth: 180,
            padding: 5,
            labelStyle: 'font-size:16px;'
        },
        items: [{
            xtype: 'textfield',
            name: 'titleView',
            readOnly:true,
            fieldLabel: 'Job Title:',
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        },
        //  {
        //     xtype: 'textfield',
        //     readOnly:true,
        //     name: 'ddo_department_idView',
        //     fieldLabel: 'Department:',
        //     afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        // },
         {
            xtype: 'textarea',
            readOnly:true,
            name: 'job_descView',
            fieldLabel: 'Job Description',
            height: 135,
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        },{
            items:[{
                xtype:'fieldcontainer',
                fieldLabel:'Salary Range',
                cls: 'fieldcontainer-cls',
                labelStyle: 'font-size:16px;',
                labelAlign: 'right',
                labelWidth:178,
                layout:'hbox',
                // margin:'0 0 0 5',
                items:[{
                    xtype:'textfield',
                    flex:1,
                    name:'minsalary',
                    width:100,
                    readOnly:true
                },{
                    xtype:'label',
                    text:'To',
                    margin:'10 10'
                },{
                    xtype:'textfield',
                    flex:1,
                    name:'maxsalary',
                    width:100,
                    readOnly:true
                },{
                    xtype:'label',
                    text:'Lacs',
                    margin:'10 10'
                }]
            }]
        }, {
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'No. of Positions',
                cls: 'fieldcontainer-cls',
                labelWidth: 178,
                width:700,
                layout: 'hbox',
                afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>',
                msgTarget: 'side',
                labelAlign: 'right',
                labelStyle: 'font-size:16px;',
                items: [{
                    xtype: 'textfield',
                    readOnly:true,
                    name: 'noofpositionsView',
                    positionlabel: 'positionlabel-cls',
                    width:80,
                    afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
                }, {
                    xtype: 'textfield',
                    readOnly:true,
                    name:'closuredateView',
                    width:250,
                    labelAlign: 'right',
                    cls:['closuredatecls','closuredatecls1'],
                    labelStyle: 'font-size:15px;width:170px;padding-right:5px',
                    fieldLabel: 'Expected Closure Date',
                    afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
                }, {
                    xtype: 'checkbox',
                    boxLabel: 'Work on Priority',
                    name: 'work_on_priorityView',
                    inputValue: 'Y',
                    width:250, 
                    checked:false,
                    readOnly: true,
                    cls:['workprioritycls','workprioritycls1'],
                    labelAlign: 'right',
                    labelStyle: 'font-size:16px;'
                }]
            }]
        }, {
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Work Experience',
                cls: 'fieldcontainer-cls',
                labelWidth: 100,
                layout: 'hbox',
                afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>',
                msgTarget: 'side',
                labelAlign: 'right',
                labelWidth: 178,
                labelStyle: 'font-size:16px;',
                items: [{
                    xtype: 'textfield',
                    readOnly:true,
                    name: 'minworkexperienceView'
                }, {
                    xtype: 'label',
                    text: 'To',
                    margin: '10 10'
                }, {
                    xtype: 'textfield',
                    readOnly:true,
                    name: 'maxworkexperienceView',
                    width: '50'
                }]
            }]
        }, {
            xtype: 'textfield',
            readOnly:true,
            fieldLabel: 'Skills',
            name: 'skill_idsView',
            border: 5,
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        }, {
            xtype: 'textfield',
            readOnly:true,
            name: 'ddo_joblocation_idView',
            fieldLabel: 'Job Location',
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        },{
            xtype: 'textfield',
            readOnly:true,
            name: 'ddo_projects_clients_id',
            fieldLabel: 'Client',           
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
        }, {
            xtype: 'textfield',
            readOnly:true,
            cls: 'tag-cls',
            name: 'interviewers_idsView',
            fieldLabel: 'Interview Panel',
            afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
        }]
    }]//,
    // bbar: {
    //     cls: 'jobform-cls',
    //     layout: {
    //         type: 'hbox',
    //         align: 'middle',
    //         pack: 'center'
    //     },
    //     padding: '25 0 21 0',  
    //     items: [{
    //         xtype: 'button',
    //         text: 'Save and Send for Approval',
    //         cls: ['approval-btn', 'approval-margin'],
    //         width: 200,
    //         disabled:true,
    //         // formBind: true,
    //         // listeners: {
    //         //     click: 'onFormSaveClick'
    //         // },
    //         style: "border-radius: 4px !important; left: 335px !important;"
    //     }, {
    //         xtype: 'button',
    //         text: 'Save Requirement',
    //         cls: 'require-btn',
    //         disabled:true,
    //         // formBind: true,
    //         // listeners: {
    //         //     click: 'onDraftSaveClick'
    //         // }
    //     }]
    // }
});