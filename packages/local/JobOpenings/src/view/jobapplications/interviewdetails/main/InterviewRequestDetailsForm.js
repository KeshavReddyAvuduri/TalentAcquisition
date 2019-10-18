Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsForm', {
    extend: 'Ext.container.Container',
    xtype: 'interviewrequestdetailsform',
    requires: ['JobOpenings.view.jobapplications.interviewdetails.TimelineContainer'],
    width: '100%',
    layout: {
        type: 'hbox'
    },

    initComponent: function() {
        this.callParent(arguments);
        Ext.ComponentQuery.query('[reference = interviewtyperef]')[0].getStore().load();
        Ext.ComponentQuery.query('[reference = interviewmoderef]')[0].getStore().load();        
    },
    items:[{
        xtype:"timelinecontainer"
    },{
        xtype: 'container',
        cls: 'intvwschcnt-cls2',
        style: "margin-bottom:80px;",
        items:[{
            xtype: 'form',
            cls: ['intvwschform-cls','intvwschform-cls3'],
            reference:'intervwformref',
            width: '100%',
            // height: 200,
            layout:'vbox',
            items:[{
                xtype:'fieldcontainer',
                layout:'hbox',
                margin: '0 0 100 0',
                items:[{
                    xtype: 'hiddenfield',
                    name: 'ddo_jobapplicationinterview_id'
                },{
                    xtype: 'combo',
                    name: 'interviewer_id',
                    //reference: 'interviewerref',
                    fieldLabel: 'Interviewer Name',
                    labelAlign: 'top',
                    emptyText: 'Select Interviewer',
                    cls:'intrvwname-cls',
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
                    // bind: {
                    //     store: '{interviewrsStore}'
                    // }
                }
                ,{
                    xtype: 'combo',
                    name: 'interviewtype',
                    labelAlign: 'top',
                    reference: 'interviewtyperef',
                    fieldLabel: 'Interview Type',
                    // editable: false,
                    cls:'intrvwtype-cls',
                    emptyText: 'Select Interview Type',
                    displayField: 'name',
                    valueField: 'id',//'interviewtype_id',
                    queryMode: 'local',
                    forceSelection: true,
                    matchFieldWidth: true,
                    clearOnBackspace: false,
                    tagCustomiseMom: true,
                    tagMomOwnerId: '123',
                    filterPickList: true,
                    typeAhead: false,
                    blankText: 'This field is required',
                    validateOnChange : true,
                    allowBlank: false,
                    // bind: {
                    //     store: '{interviewTypeStore}'
                    // }
                },{
                    xtype: 'combo',
                    name: 'interviewmode',
                    labelAlign: 'top',
                    reference: 'interviewmoderef',
                    fieldLabel: 'Interview Mode',
                    editable: false,
                    cls:'intrvwmode-cls',
                    emptyText: 'Select Interview Mode',
                    displayField: 'name',
                    valueField: 'id',//'interviewmode_id',
                    queryMode: 'local',
                    forceSelection: true,
                    matchFieldWidth: true,
                    clearOnBackspace: false,
                    tagCustomiseMom: true,
                    tagMomOwnerId: '123',
                    filterPickList: true,
                    typeAhead: false,
                    blankText: 'This field is required',
                    allowBlank: false,
                    // bind: {
                    //     store: '{interviewModeStore}'
                    // }
                },{
                    xtype: 'datefield',
                    //cls: 'mom-start-date-cls',
                    editable: false,
                    required: true,
                    allowBlank: false,
                    cls:['intrvwdate-cls','intrvwdate-clss'],
                    style:"margin: 0px; right: auto; left: 318px; top: -22px;",
                    fieldLabel: 'Date',
                    labelAlign: 'top',
                    format:'Y-m-d',
                    alwaysOnTop: true,
                    name: 'interviewdate',
                    disabledCls: 'notestatus-item-disabled',
                    reference: 'fromDate',
                    bind: {
                        value: '{interviewdate}'
                    },
                    emptyText: 'Select Date',
                    //format: 'Y-m-d',
                    listeners: {
                        //select: 'startDateClick'
                    },
                    minValue: new Date(),
                    createPicker: function () {
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
                                esc: function () {
                                    me.collapse();
                                }
                            }
                        });
                    }
                }, {
                    xtype: 'timefield',
                    name: 'interviewtime',
                    reference: 'intvwTime',
                    cls:['intrvwtime-cls','intrvwtime-clss'],
                    fieldLabel: 'Time',
                    labelAlign: 'top',
                    //disabledCls: 'mom-item-disabled',
                    required: true,
                    allowBlank: false,
                    bind: {
                        value: '{interviewtime}'
                    },
                    editable: false,
                    //cls: 'mom-start-time-cls',
                    emptyText: 'Select Time',
                    minValue: '8:00 AM',
                    maxValue: '8:00 PM',
                    hideTrigger: false,
                    //format: 'H-i A',
                    format: 'g-i A',
                    increment: 30,
                    listConfig: {
                        cls: 'mom-stime-cls'
                    }
                }]
            
            },
            {       

                        xtype: 'button',
                        text: 'Save',
                        reference: 'intvwsavebtnref',
                        cls: ['intvwsave-btn','intvwsave-bttn'],
                        formBind: true,
                        listeners: {
                            click: 'onInterviewSaveBtnClick2'
                        }
             },
             {
                xtype: 'buttongroup',
                cls:['singlebtngrp-cls','intvwcancel-bttn'],
                reference:'intvwbtngrpref',
                 columns: 1,
                 items: [{
                     text: 'Cancel',
                     cls: 'intvwcancel-btn',
                     //formBind: true,
                     listeners:{
                         click:'onCancelIntvwClick'
                     }
                 }/* {
                     text: 'Reschedule',
                     cls: 'intvwcancel-btn',
                     bind: {
                         hidden: '{btnsHide}'
                     },
                     listeners:{
                         click:'onRescheduleClick'
                     }
                 }, {
                     text: 'Delete',
                     cls: 'intvwcancel-btn',
                     bind: {
                         hidden: '{btnsHide}'
                     },
                     listeners:{
                         click:'onDeleteIntvwClick'
                     }
                 }]
             }*/]
            }
        ]

    }] 
}]
});