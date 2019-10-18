Ext.define('JobOpenings.view.jobapplications.interviewdetails.ScheduleFeedBackView', {
    extend: 'JobOpenings.view.jobapplications.interviewdetails.TimelineContainer',
    xtype: 'schedulefeedbackview',
    width: '100%',
    cls: 'feedbkcnt-cls',
    bind: {
        hidden: '{awaitingfeedviewHide}'
    },
    config: {
        feedbkformData: ''
    },
    items: [{
        xtype: 'dataview',
        reference: 'feedbackdataviewref',
        // bind: {
        //    data:'{feedbkformData}'
        // },
        data: "",
        itemTpl: [           
            '<table class="feedbktable-cls">',
            '<tr class="feedbktr-cls">',
            '<th class="nameheader-cls" width="20%">Interviewer Name</th>',
            '<th class="typeheader-cls" width="15%">Interviewer Type</th>',
            '<th class="dtheader-cls" width="15%">Date&Time</th>',
            '<th class="ratingheader-cls" width="15%">Rating</th>',
            '<th class="fdbkheader-cls"></th>',
            '<th class="fdbkheade-cls"></th>',
            '</tr>',
            '<tr class="datatr-cls">',
            '<td>{interviewrname}</td>',
            '<td>{interviewtype}</td>',
            '<td>{[this.convertDate(values)]}<div>{interviewtime}</div></td>',
            '<td>{[this.getRatingIcon(values)]}</td>',
            '<td class ="fdbktd-cls">Awaiting for Feedback</td>',
            '<td class ="fdbktd-cls">',
            '<div>Cancel</div>',
            '<div>Reschedule</div>',
            '<div>Delete</div>',
            '</td>',
            '</tr>',
            '</table>',
            {
                getRatingIcon: function(values) {/*to get properinterview rating type and show*/
                    var ratingname = values.ratingname,
                        imgurl = values.ratingimgpath;
                        return "TBD";
                },
                convertDate: function(values) {/*to convert date and show*/
                    var intervwDate = values.interviewdate;
                    return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
                }
            }],
        itemSelector: 'div.intvwdiv-cls'
    }],
    listeners: {
        boxready: function() {/*feedback record on box ready*/
            var feedbkRecord = this.config.feedbkformData;
            var vw = this.down('dataview');
            vw.setData(feedbkRecord);
        }
    }
});