Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsAll', {
    extend: 'Ext.container.Container',
    xtype: 'interviewrequestdetailsall',
    width: '99%',
    style: "padding-left: 63px;",
    reference:'interviewrequestdetailsallref',
    cls:'requestdetails-cls',
    items: [{
        xtype: 'dataview',
        reference: 'feedbackdataviewrref',
        // bind: {
        //     store: '{interviewFeedBackStore}'
        // },
        data: "",
        cls: "jobappviewcls_spacing",
        itemTpl: [
            '<div class="myPanelsCls" style="text-align:center">',

            '<div class="timeline-item jobtimelinecls2">',
            '<div class="timeline-day"></div>',
            '<div class="timeline-outer"><div class="timeline-inner">',
            '</div>',
            '</div>',
            '</div>',

            '<table class="feedbktable2-cls" style="{[this.backgrndColor(values)]}">',
            '<tr class="feedbktr-cls" style="{[this.backgrndColor(values)]}">',
            '<th class="nameheader-cls" width="15%">Interviewer Name</th>',
            '<th class="typeheader-cls" width="15%">Interviewer Type</th>',
            '<th class="typeheader-cls" width="15%">Interviewer Mode</th>',
            '<th class="dtheader-cls" width="12%">Date&Time</th>',
            '<th class="ratingheader-cls" width="10%">Rating</th>',

            '<th width="" class="fdbkheader-cls" style="padding-top: 17px; display:{[this.isHiddenFeedback1(values, 1)]};">Feedback</th>',

            '<th class="nameheader-cls" width="56%" style="margin-top:30px; display:{[this.isHiddenAwaitingFeedback(values)]};">{[this.checkHiddenHeader(values, 1)]}</th>',
            '<th class="nameheader-cls" width="0%" style="display:{[this.isHiddenAwaitingFeedback(values)]};"></th>',

            '</tr>',
            '<tr class="datatr-cls">',
            '<td width="15%" class="intervw-sched-dt-cls">{interviewrname}</td>',
            '<td width="15%" class="intervw-sched-dt-cls">{[this.onIntervwTypeVal(values)]}</td>',
            '<td width="15%" class="intervw-sched-dt-cls">{[this.onIntervwModeVal(values)]}</td>',
            '<td width="12%" class="intervw-sched-dt-cls">{[this.convertDate(values)]}<div>{interviewtime}</div></td>',
            '<td width="10%" class="intervw-sched-dt-cls">{[this.getRatingIcon(values)]}</td>',

            '<td width="288%" class="intervw-sched-feed-dt-cls fdbktd-cls" style="display:{[this.isHiddenFeedback1(values, 1)]};">{feedback}</td>',

            '<td width="32%" style="color: {[this.ifFeedbackAwaiting(values)]};" style="display:{[this.isHiddenAwaitingFeedback(values)]};">{[this.checkHiddenHeader(values, 2)]}</td>',
            '<td width="80%" style="display:{[this.isHiddenAwaitingFeedback(values)]};">{[this.checkHiddenHeader(values, 3)]}</td>',

            '</tr>',
            '</table>',
            '</div>',
            {
                getRatingIcon: function(values) {/*to get proper rating icon*/
                    if (values.ddo_jobinterviewstatus_id == 2) {
                        var ratingname = values.ratingname,
                            imgurl = values.ratingimgpath;
                        return '<div><img class="intvwratingimg-cls" src="resources/images/feeds/likes/' + ratingname + '.png' + '"><div>' + ratingname + '</div></div>';
                    } else {
                        return '<div>TBD</div>';
                    }
                },
                convertDate: function(values) {/*to convert date & show*/
                    var intervwDate = values.interviewdate;
                    return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
                },
                onIntervwTypeVal: function(values) {/*for interview type value*/
                    if (values.interviewtype == 1) {
                        return "Technical";
                    } else if(values.interviewtype == 2) {
                            return "HR";
                    }
                    else return "Manager";
                },
                onIntervwModeVal: function(values){
                    if(values.interviewmode == 1){
                        return "Telephonic";
                    }else if(values.interviewmode == 2){
                        return "Skype";
                    }else return "FacetoFace";
                },
                isHiddenFeedback1: function(values, check) {/*for feedback hide/show*/
                    if (values.ddo_jobinterviewstatus_id == 2 && check == 1) {
                        return "block";
                    } else {
                        return "none";
                    }
                },
                isHiddenAwaitingFeedback: function(values) {/*for feedbacks type and hide/show*/
                    if (values.ddo_jobinterviewstatus_id == 1 || values.ddo_jobinterviewstatus_id == 3 || values.ddo_jobinterviewstatus_id == 4) {
                        return "block";
                    } else {
                        return "none";
                    }
                },
                checkHiddenHeader: function(values, check) {/*to show proper header*/
                    if (check == 1) {
                        if (values.ddo_jobinterviewstatus_id == 1) {
                            return "";
                        }
                        if (values.ddo_jobinterviewstatus_id == 3) {
                            return "Reason for Rescheduling";
                        }
                        if (values.ddo_jobinterviewstatus_id == 4) {
                            return "Reason for Cancel";
                        }
                    }
                    if (check == 2) {
                        if (values.ddo_jobinterviewstatus_id == 1) {
                            return "Awaiting for Feedback";
                        }
                        if (values.ddo_jobinterviewstatus_id == 3) {
                            return values.feedback;
                        }
                        if (values.ddo_jobinterviewstatus_id == 4) {
                            return values.feedback;
                        }
                    }
                    if (check == 3) {
                        if (values.ddo_jobinterviewstatus_id == 1) {
                            var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
                            if (mainViewModel.data.addInterviewShow == true) {
                                return '<div class="intervw-sched-cancel-link-cls"><i class="cancel-interview-iconcls arrow-cls"></i>Cancel</div><div class="intervw-sched-reschedule-link-cls"><i class="reschedule-interview-iconcls arrow-cls"></i>Reschedule</div><div class="intervw-sched-delete-link-cls"><i class="delete-interview-iconcls arrow-cls"></i>Delete</div>';
                            }
                        }
                        if (values.ddo_jobinterviewstatus_id == 3) {
                            return '<i class="rescheduled-interview-iconcls arrow-cls"></i>Interview Rescheduled';
                        }
                        if (values.ddo_jobinterviewstatus_id == 4) {
                            return '<i class="cancel-interview-iconcls arrow-cls"></i>Interview Canceled';
                        }
                    }
                },
                backgrndColor: function(values) {/*to change background color for cancelled and rescheduled statuses*/
                    if (values.ddo_jobinterviewstatus_id == 3) {
                        return "background-color: #FFF6E5;"
                    }
                    if (values.ddo_jobinterviewstatus_id == 4) {
                        return "background-color: #F3F3F3;"
                    }
                },
                ifFeedbackAwaiting: function(values) {/*to show proper text color*/
                    if (values.ddo_jobinterviewstatus_id == 1) {
                        return "#5dc27c";
                    } else {
                        return "black";
                    }
                }
            }],
        itemSelector: 'div.myPanelsCls',
        listeners: {
            itemclick: 'onMyPanelsClick'
        }
    }]
});