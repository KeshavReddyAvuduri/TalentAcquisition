Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewFeedBack', {
    extend: 'Ext.container.Container',
    xtype: 'interviewfeedback',
    width: '100%',
    cls: 'feedbkcnt-cls feedbkcnt2-cls',
    requires: [
        'JobOpenings.view.jobapplications.JobApplicationsViewModel',
        'JobOpenings.view.jobapplications.JobApplicationsViewController'
    ],
    bind: {
        hidden: '{viewHide}'
    },
    controller: 'jobapplicationsviewController',
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
    items: [{
        xtype: 'dataview',
        reference: 'feedbackdataviewrref',
        // bind: {
        //     store: '{interviewFeedBackStore}'
        // },
        itemTpl: [
            '<table class="feedbktable-cls" >',
            '<tr class="feedbktr-cls">',
            '<th class="nameheader-cls" width="20%">Interviewer Name</th>',
            '<th class="typeheader-cls" width="15%">Interviewer Type</th>',
            '<th class="dtheader-cls" width="15%">Date&Time</th>',
            '<th class="ratingheader-cls" width="15%">Rating</th>',
            '<th class="fdbkheader-cls">Feedback</th>',
            '</tr>',
            '<tr class="datatr-cls">',
            '<td>{interviewrname}</td>',
            '<td>{[this.onIntervwTypeVal(values)]}</td>',
            '<td>{[this.convertDate(values)]}<div>{interviewtime}</div></td>',
            '<td>{[this.getRatingIcon(values)]}</td>',
            '<td class ="fdbktd-cls">{feedback}</td>',
            '</tr>',
            '</table>',
            {
                getRatingIcon: function(values) {/*to get proper ratings icon*/
                    var ratingname = values.ratingname,
                        imgurl = values.ratingimgpath;
                    return '<div><img class="intvwratingimg-cls" src="resources/images/feeds/likes/' + ratingname + '.png' /*+ values.ratingimgpath*/ + '"><div>' + ratingname + '</div></div>';
                },
                convertDate: function(values) {/*to convert date & show*/
                    var intervwDate = values.interviewdate;
                    return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
                },
                onIntervwTypeVal: function(values) {/*for interview type value*/
                    if (values.interviewtype == 2) {
                        return "Telephonic";
                    } else {
                        return "Face-to-Face";
                    }
                }
            }],
        itemSelector: 'div.intvwdiv-cls'
    }]
});