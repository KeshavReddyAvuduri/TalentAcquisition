Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewDataview', {
    extend: 'Ext.container.Container',
    xtype: 'interviewdataview',
    width: '100%',
    bind:{
        hidden:'{initialInterviewShow}'
    },
    requires: [
     'JobOpenings.view.jobapplications.interviewdetails.TimelineContainer'
    ],
    layout: {
        type: 'hbox'
    },
    reference:'interviewdvref',
    items:[{
        xtype:'timelinecontainer'
    },{
        xtype: 'container',
        cls: 'intvwschcnt-cls',
        
        items: [{
            xtype: 'form',
            cls: 'intvwschform-cls',
            reference:'intervwformref',
            width: '100%',
            height: 130,
            layout: 'hbox',
            items: [{
                xtype: 'hiddenfield',
                name: 'ddo_jobapplicationinterview_id'
            },{
                xtype: 'combo',
                name: 'interviewer_id',
                reference: 'interviewerref',
                fieldLabel: 'Interview Panel',
                labelAlign: 'top',
                emptyText: 'Select Interviewer',
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
                bind: {
                    // store: '{interviewrsStore}'
                }
            }, {
                xtype: 'combo',
                name: 'interviewtype',
                labelAlign: 'top',
                reference: 'interviewtyperefdata',
                fieldLabel: 'Interview Type',
                emptyText: 'Select Interview Type',
                displayField: 'name',
                valueField: 'interviewtype_id',
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
                bind: {
                    // store: '{interviewTypeStore}'
                }
            }, {
                xtype: 'datefield',
                editable: false,
                required: true,
                fieldLabel: 'Date',
                labelAlign: 'top',
                alwaysOnTop: true,
                format:'Y-m-d',
                name: 'interviewdate',
                disabledCls: 'notestatus-item-disabled',
                reference: 'fromDate',
                bind: {
                    value: '{interviewdate}'
                },
                emptyText: 'Select Date',
                minValue: new Date(),
                createPicker: function() {/*to create date picker*/
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
                fieldLabel: 'Time',
                labelAlign: 'top',
                required: true,
                bind: {
                    value: '{interviewtime}'
                },
                editable: false,
                emptyText: 'Select Time',
                minValue: '00:00',
                maxValue: '24:00',
                hideTrigger: false,
                format: 'H-i',
                increment: 30,
                listConfig: {
                    cls: 'mom-stime-cls'
                }
            }, {
                xtype: 'button',
                text: 'Save',
                reference: 'intvwsavebtnref',
                cls: 'intvwsave-btn',
                formBind: true,
                listeners: {
                    click: 'onInterviewSaveBtnClick'
                }
            }, {
                xtype: 'buttongroup',
               cls:'singlebtngrp-cls',
               reference:'intvwbtngrpref',
                columns: 1,
                items: [{
                    text: 'Cancel',
                    cls: 'intvwcancel-btn',
                    formBind: true,
                    listeners:{
                        click:'onCancelIntvwClick'
                    }
                }, {
                    text: 'Reschedule',
                    cls: 'intvwcancel-btn',
                    bind: {
                        hidden: '{cancelReschedulebtnsHide}'
                    },
                    listeners:{
                        click:'onRescheduleClick'
                    }
                }, {
                    text: 'Delete',
                    cls: 'intvwcancel-btn',
                    bind: {
                        hidden: '{cancelReschedulebtnsHide}'
                    },
                    listeners:{
                        click:'onDeleteIntvwClick'
                    }
                }]
            }]

        }]
    }]
});