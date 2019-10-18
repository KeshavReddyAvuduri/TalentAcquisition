Ext.define('JobOpenings.view.interviewrequest.InterviewRequest', {
    extend: 'Ext.container.Container',
    xtype: 'interviewrequest',
    requires:[
        'JobOpenings.view.interviewrequest.InterviewRequestController',
        'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel',
        'JobOpenings.view.interviewrequest.InterviewRequestDesign',
        'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView',
        'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackMain'
    ],
    layout: {
        type: 'card',
        activeItem: 0
    },
    controller: 'interviewrequestcontroller',
    viewModel: {
        type: 'filterviewmodel'
    },
    margin: '10 0 0 10',
    reference: 'interviewreference',
    items:[{
        xtype:'interviewrequestdesign'
    }, {
        xtype:'interviewrequestfeedbackmain'
    }]
});