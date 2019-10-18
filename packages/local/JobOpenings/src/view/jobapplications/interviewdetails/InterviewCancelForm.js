Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewCancelForm', {
    extend: 'Ext.container.Container',
    xtype: 'interviewcancelform',
    width: '100%',
    bind: {
        hidden: '{cancelformshow}'
    },
    requires: [
        'JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule'
    ],
    items: [{
        xtype: 'addinterviewschedule',
        bind:{
            hidden:'{addIntvwschviewHide}'
        }
    },{
        xtype: 'container',
        cls: 'intvwschcnt-cls',
        reference:'intvwcancelcntref',
        items: [{
            xtype: 'form',
            cls: 'intvwschform-cls cancelform-cls',
            reference: 'intervwcancelformref',
            width: '100%',
            height: 130,
            layout: 'hbox',
            items: [{
                xtype: 'hiddenfield',
                name: 'ddo_jobapplicationinterview_id'
            }, {
                xtype: 'combo',
                name: 'interviewer_id',
                reference: 'empnameref',
                fieldLabel: 'Interview Panel',
                labelAlign: 'top',
                emptyText: 'Select Interviewer',
                displayField: 'empname',
                valueField: 'empid',
                queryMode: 'local',
                hideTrigger:true,
                disabled:true,
                width:'17%',
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
                    // store: '{interviewrsStore}',
                    value:'{empname}'
                }
            }, {
                xtype: 'combo',
                name: 'interviewtype',
                labelAlign: 'top',
                reference: 'inttyperef',
                fieldLabel: 'Interview Type',
                emptyText: 'Select Interview Type',
                displayField: 'name',
                valueField: 'interviewtype_id',
                queryMode: 'local',
                forceSelection: false,
                hideTrigger:true,
                disabled:true,
                matchFieldWidth: true,
                clearOnBackspace: false,
                tagCustomiseMom: true,
                tagMomOwnerId: '123',
                filterPickList: true,
                typeAhead: false,
                blankText: 'This field is required',
                allowBlank: false,
                width:'15%',
                bind: {
                    // store: '{interviewTypeStore}',
                    value:'{interviewtype}'
                }
            }, {
                xtype: 'datefield',
                editable: false,
                required: true,
                fieldLabel: 'Date',
                labelAlign: 'top',
                alwaysOnTop: true,
                disabled:true,
                width:'15%',
                name: 'interviewdate',
                hideTrigger:true,
                reference: 'fmdateref',
                bind: {
                    value: '{interviewdate}'
                },
                emptyText: 'Select Date'

            }, {
                xtype: 'displayfield',
                fieldLabel: 'Rating',
                cls:'ratingcancel-cls',
                name: 'rating',
                labelAlign: 'top',
                disabled:true,
                width:'10%',
                value: 'TBD'
            }, {
                xtype: 'textareafield',
                grow: false,
                cls:'canceltextarea-cls',
                labelAlign: 'top',
                reference:'canceltextarearef',
                width:'35%',
                name: 'Reason-for-Cancelling',
                fieldLabel: 'Reason for Cancelling'
            }, {
                xtype: 'buttongroup',
                cls: 'singlebtngrp-cls cancelbtngrp',
                reference: 'intvwcancelbtngrp',
                columns: 1,
                width:'18%',
                items: [{
                    text: 'Confirm',
                    cls: 'intvwconfirm-btn',
                    reference:'confirmbtnref',
                    listeners:{
                        click:'onConfirmClick'
                    }
                }, {
                    text: 'Cancel',
                    cls: 'intcancl-btn',
                    reference:'intvwcancelbtnref',
                    listeners: {
                        click: 'onCancelClick'
                    }
                }]
            }]

        }]
    }]
});