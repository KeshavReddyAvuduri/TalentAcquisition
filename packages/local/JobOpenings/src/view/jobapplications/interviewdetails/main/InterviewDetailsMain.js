Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewDetailsMain', {
    extend: 'Ext.container.Container',
    xtype: 'interviewdetailsmain',
    requires: [
        'JobOpenings.view.jobapplications.interviewdetails.InterviewDataview',
        'JobOpenings.view.jobapplications.interviewdetails.main.OnInterviewScheduled'
    ],
    layout: {
        type: 'card',
        activeItem: 1
    },
    margin: '10 0 0 10',
    width:'100%',
    reference: 'interviewdetailsmainref',
    items: [{
        xtype:'interviewdataview'
    }, {
        xtype:'oninterviewscheduled'
    }]
});