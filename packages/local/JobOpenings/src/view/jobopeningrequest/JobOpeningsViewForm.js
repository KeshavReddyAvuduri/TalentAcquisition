Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsViewForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.jobopeningsviewform',
    xtype: 'jobopeningsviewform',
    cls: 'form-cls',
    reference: 'jobform',
    listeners: {
        afterrender: function () {
            this.up('jobopeningsrequestview').getViewModel().getStore('ProjectsClientStore').load();
            this.up('jobopeningsrequestview').getViewModel().getStore('skillsStore').load();
            this.up('jobopeningsrequestview').getViewModel().getStore('locationStore').load();
            this.up('jobopeningsrequestview').getViewModel().getStore('interviewrsStore').load();
        }
   },
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'tooltip-cls',
        dock: 'top',
        items: [{
            xtype: 'button',
            scale: 'medium',
            iconCls: 'x-fa fa-long-arrow-alt-left',
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
        reference: 'jobopenform',
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
            xtype: 'hiddenfield',
            name: 'ddo_jobopening_id'
        }, {
            xtype: 'textfield',
            name: 'title', // same as field name in the table
            required: true,
            reference: 'jobtitleref',
            fieldLabel: 'Job Title:',
            emptyText: 'Write Job Title Eg: Technical Lead',
            emptyCls:'referrals-empty-text',
            allowBlank: false, // requires a non-empty value
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
            bind: {
                value: 'title'
            }
        }, 
        // {
        //     xtype: 'combobox',
        //     name: 'ddo_department_id',
        //     reference: 'departmentref',
        //     fieldLabel: 'Department:',
        //     bind: {
        //         store: '{departmentStore}'
        //     },
        //      // listConfig:{
        //     //     cls:'alignRight',
        //     //  },
        //     required: true,
        //     emptyText: 'Select Department',
        //     emptyCls:'referrals-empty-text',
        //     typeAhead: false,
        //     displayField: 'name', // from fields in model
        //     valueField: 'ddo_department_id',
        //     forceSelection: true,
        //     editable: false,
        //     allowBlank: false,
        //     tpl: Ext.create('Ext.XTemplate',
        //     '<ul class="x-list-plain"><tpl for=".">',
        //         '<li role="option" class="x-boundlist-item" style="text-align:center;">{name}</li>',
        //     '</tpl></ul>'
        // ),
        // // template for the content inside text field
        // displayTpl: Ext.create('Ext.XTemplate',
        //     '<tpl for=".">',
        //         '{name}',
        //     '</tpl>'
        // ),
            
        //     queryMode: 'local',
        //     afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
        //     listeners: {
        //         render: 'onDepartmentRender'
        //     }
        // }, 
        
        {
            xtype: 'htmleditor',
            cls: 'editor-cls',
            name: 'job_desc',
            reference: 'editorref',
            fieldLabel: 'Job Description',
            id: 'myEditor',
            submitEmptyText: false,
            required: true,
            enableFont: false,
            enableLists: false,
            enableLinks:true,
            enableAlignments: true,
            enableSourceEdit: false,
            enableColors: false,
            enableFontSize: false,
            allowBlank: false,
                isValid : function() {
                var val = this.getValue();
                if(val){
                    return true;
                }else return false;
             },
            border: 1,
            labelCls: 'html-editor-label',
            validateOnChange: true,
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
        },
        {
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
                    emptyCls:'referrals-empty-text',
                    emptyText:'0',
                    name:'minsalary',
                    minLength:0,
                    maxLength:5,
                    width:100,
                    enforceMaxLength:true,
                    maskRe:/^[0-9]*$/
                },{
                    xtype:'label',
                    text:'To',
                    margin:'10 10'
                },{
                    xtype:'textfield',
                    flex:1,
                    emptyCls:'referrals-empty-text',
                    emptyText:'0',
                    name:'maxsalary',
                    minLength:0,
                    maxLength:5,
                    width:100,
                    enforceMaxLength:true,
                    maskRe:/^[0-9]*$/
                },{
                    xtype:'label',
                    text:'Lacs',
                    margin:'10 10'
                }]


            }]
        },
         {
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'No. of Positions',
                cls: 'fieldcontainer-cls',
                allowBlank: false,
                labelWidth: 178,
                width:700,
                layout: 'hbox',
                afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
                msgTarget: 'side',
                labelAlign: 'right',
                labelStyle: 'font-size:16px;',
                items: [{
                    xtype: 'numberfield',
                    name: 'noofpositions',
                    reference: 'positionref',
                    positionlabel: 'positionlabel-cls',
                    allowBlank: false,
                    maskRe: /^[0-9]*$/,
                    width:80,
                    minValue: 1,
                    value:0,
                    enableKeyEvents:true,
                    invalidText: "Please enter valid data",
                    afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
                    listeners:{
                        focusleave:'onNoofPositeionsEnter'
                    }
                }, {
                    xtype: 'datefield',
                    editable: true,
                    required: true,
                    name:'closuredate',
                    width:250,
                    labelAlign: 'right',
                    format: 'd-m-Y',
                    submitFormat:'Y-m-d',
                    maskRe: /[0-9\-\/]/,
                    allowBlank: false,
                    cls:['closuredatecls','closuredatecls1'],
                    labelStyle: 'font-size:15px;width:170px;padding-right:5px',
                    fieldLabel: 'Expected Closure Date',
                    afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
                    minValue: new Date(),
                    createPicker: function() {
                        var me = this,
                            format = Ext.String.format;

                        return Ext.create('Ext.picker.Date', {
                            pickerField: me,
                            ownerCt: me.ownerCt,
                            renderTo: document.body,
                            floating: true,
                            hidden: true,
                            focusOnShow: true,
                            cls: 'ddo-create-datepicker',
                            minDate: me.minValue,
                            maxDate: me.maxValue,
                            disabledDatesRE: me.disabledDatesRE,
                            disabledDatesText: me.disabledDatesText,
                            disabledDays: me.disabledDays,
                            disabledDaysText: me.disabledDaysText,
                            format: me.format,
                            showToday: me.showToday,
                            startDay: me.startDay,
                            minText: format(me.minText, me.formatDate(me.minValue)),
                            maxText: format(me.maxText, me.formatDate(me.maxValue)),
                            listeners: {
                                scope: me,
                                select: me.onSelect
                            },
                            keyNavConfig: {
                                esc: function() {
                                    me.collapse();
                                }
                            }
                        });
                    },  
                    listeners: {
                       focusleave:"onKeyDownDate"
                   }
                }, {
                    xtype: 'checkbox',
                    boxLabel: 'Work on Priority',
                    name: 'work_on_priority',
                    inputValue: 'Y',
                    width:250, 
                    checked:false,
                    cls:['workprioritycls','workprioritycls1'],
                    labelAlign: 'right',
                    labelStyle: 'font-size:16px;',
                    reference:'jobworkcheckboxref'
                }]
            }]
        }, {
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Work Experience',
                cls: 'fieldcontainer-cls',
                allowBlank: false,
                labelWidth: 100,
                layout: 'hbox',
                afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
                msgTarget: 'side',
                labelAlign: 'right',
                labelWidth: 178,
                labelStyle: 'font-size:16px;',
                items: [{
                    xtype: 'numberfield',
                    emptyText: 'Minimum',
                    emptyCls:'referrals-empty-text',
                    reference: 'minref',
                    name: 'minworkexperience',
                    minValue: 0,
                    enableKeyEvents: true,
                    allowBlank: false,
                    mouseWheelEnabled: false,
                    listeners: {
                        blur: 'onMinValueSelect'
                    }
                }, {
                    xtype: 'label',
                    text: 'To',
                    margin: '10 10'

                }, {
                    xtype: 'numberfield',
                    emptyText: 'Maximum',
                    emptyCls:'referrals-empty-text',
                    allowBlank: false,
                    mouseWheelEnabled: false,
                    reference: 'maxref',
                    minValue: 0,
                    enableKeyEvents: true,
                    name: 'maxworkexperience',
                    width: '50',
                    listeners: {
                        blur: 'onMaxValueSelect'
                    }
                }]
            }]
        }, {
            xtype: 'tagfield',
            fieldLabel: 'Skills',
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
            name: 'skill_ids',
            hideTrigger: true,
            reference: 'skillref',
            emptyText: 'Use Words Eg : Angular JS',
            emptyCls:'referrals-empty-text1',
            bind: {
                store: '{skillsStore}'
            },
            displayField: 'name',
            valueField: 'ddo_skills_id',
            queryMode: 'local',
            forceSelection: false,
            maskRe: /^[A-Za-z0-9]*$/,
            autoShow: true,
            selectOnTab:true,
            tabIndex:1,
            filterPickList: true,
            blankText: 'This field is required',
            border: 5,
            collapseOnSelect:true,
            allowBlank: false,
            clearFilterOnBlur:false,
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
            listeners: { 
                render: 'onSkillRender',
                select: function(combo, record, eOpts) {
                     combo.inputEl.dom.value = '';
                     combo.lastMutatedValue ='';
                }
            }
        }, {
            xtype: 'combobox',
            name: 'ddo_joblocation_id',
            fieldLabel: 'Job Location',
            reference: 'locationref',
            queryMode: 'local',
            emptyText: 'Select Location',
            emptyCls:'referrals-empty-text',
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
            editable: false,
            typeAhead: false,
            bind: {
                store: '{locationStore}'
            },
            displayField: 'name',
            valueField: 'ddo_joblocation_id',
            allowBlank: false,
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
            listeners: {
                render: 'onJobLocationRender'
            }
        },{
            xtype: 'combobox',
            name: 'ddo_projects_clients_id',
            fieldLabel: 'Client',
            reference: 'clientref',
            queryMode: 'local',
            emptyText: 'Select Client',
            emptyCls:'referrals-empty-text',
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
            editable: false,
            typeAhead: false,
            bind:{
                store:'{ProjectsClientStore}'
            },
            displayField: 'name',
            valueField: 'ddo_projects_clients_id',
            // allowBlank: false,
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',    
                 
        }, {
            xtype: 'tagfield',
            cls: 'tag-cls',
            name: 'interviewers_ids',
            reference: 'interviewref',
            fieldLabel: 'Interview Panel',
            hideTrigger: true,
            emptyText: 'Type Users Eg : Will Smith',
            emptyCls:'referrals-empty-text1',
            displayField: 'empname',
            valueField: 'empid',
            queryMode: 'local',
            forceSelection: false,
            matchFieldWidth: true,
            clearOnBackspace: false,
            tagCustomiseMom: true,
            tagMomOwnerId: '123',
            filterPickList: true,
            typeAhead: false,
            blankText: 'This field is required',
            allowBlank: false,
            afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
            bind: {
                store: '{interviewrsStore}'
            },
            listeners: {
                render: 'onInterviewRender',
                select: function(combo, record, eOpts) { /* for interviewer selected*/
                    combo.inputEl.dom.value = '';
                    combo.collapse();
                }
            }
        }]
    }],
    bbar: {
        cls: 'jobform-cls',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'center'
        },
        padding: '25 0 21 0',  
        items: [{
            xtype: 'button',
            text: 'Save and Send for Approval',
            cls: ['approval-btn', 'approval-margin'],
            width: 200,
            formBind: true,
            listeners: {
                click: 'onFormSaveClick'
            },
            style: "border-radius: 4px !important; left: 335px !important;"
        }, {
            xtype: 'button',
            text: 'Save Requirement',
            cls: 'require-btn',
            formBind: true,
            listeners: {
                click: 'onDraftSaveClick'
            }
        }]
    }
});