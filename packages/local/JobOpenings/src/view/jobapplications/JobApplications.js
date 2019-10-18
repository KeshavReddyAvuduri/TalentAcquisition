Ext.define('JobOpenings.view.jobapplications.JobApplications', {
    extend: 'Ext.container.Container',
    xtype: 'jobapplications',
    requires: [
        'JobOpenings.view.jobapplications.JobApplicationRequestListView',
        'JobOpenings.view.jobapplications.JobApplicationsAppliedListView',
        'JobOpenings.view.jobapplications.JobAppliedFormController',
        'JobOpenings.view.jobapplications.JobApplyMain',
        'JobOpenings.view.jobapplications.interviewdetails.ScheduleInterview',
        'JobOpenings.view.jobapplications.JobApplicationViewMode'
    ],
    layout: {
        type: 'card',
        activeItem: 0
    },
    margin: '10 0 0 10',
    reference: 'jobapplicationreference',
    items: [{
        xtype:'jobapplicationrequest',
        id: 'mainList'
    },  {
        xtype: 'jobapplicationsappliedlistview',
        id: 'appliedList'
    },  {
        xtype: 'jobapplymain',
        id:'jobapply'
    }, {
        xtype: 'scheduleinterview',
        id: 'interviewschd'
    }, {
        xtype: 'jobapplicationviewmode',
        id: 'jobapplicationviewmodeId'
    }]
});