Ext.define('JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView', {
    //extend: 'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestTimelineContainer',
    extend: 'Ext.container.Container',
    xtype: 'interviewrequestfeedbackview',
    width: '99%',
    style: "padding-left: 63px; padding-top: 58px;",
    reference: 'interviewrequestfeedbackviewref',
    requires: [
        'JobOpenings.view.interviewrequest.InterviewRequestModel',
        'JobOpenings.view.interviewrequest.InterviewRequestController'
    ],

    controller: 'interviewrequestcontroller',
    viewModel: {
        type: 'interviewrequestmodel'
    },

    items: [{
        xtype: 'dataview',
        reference: 'feedbackdataviewref',
        // bind: {
        //     store: '{interviewReqFeedBackStore}'
        // },
        data: "",
        cls: "jobappviewcls_spacing",
        itemTpl: [
            '<div class="myPanelsCls" style="text-align:center;">',

            '<div class="timeline-item jobtimelinecls3">',
            '<div class="timeline-day"></div>',
            '<div class="timeline-outer"><div class="timeline-inner">',
            '</div>',
            '</div>',
            '</div>',

            '<table class="feedbktable-cls">',
            '<tr class="feedbktr-cls">',
            '<th class="nameheader-cls">Interviewer Name</th>',
            '<th class="typeheader-cls">Interviewer Type</th>',
            '<th class="typeheader-cls">Interviewer Mode</th>',
            '<th class="dtheader-cls">Date&Time</th>',
            '<th class="ratingheader-cls">Rating</th>',
            '<th class="">Feedback</th>',
            '<th class=""></th>',
            '</tr>',
            '<tr class="datatr-cls">',
            '<td>{interviewrname}</td>',
            '<td>{[this.onIntervwTypeVal(values)]}</td>',
            '<td>{[this.onIntervwModeVal(values)]}</td>',
            '<td>{[this.convertDate(values)]}<div>{[this.showInterviewtime(values)]}</div></td>',
            '<td>{[this.getRatingIcon(values)]}</td>',
            '<td class="">{[this.onFeedbackVal(values)]}<br></td>',
            '<td class=""><button class="intvwsubmit-btn" name="submit" id="submit" >Submit</button><br> ',
            '<label class="intrvwReqCancel_lbl" name="cancel">Cancel</label></td>',
            '</tr>',
            '</table>',
            '</div>',
            {
                getRatingIcon: function(values) { /* for correct rating icon display*/
                    var ratingname = values.ratingname;
                    var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr);
                    var liHtml = "";
                    xRatingStr.data.forEach(function(item){
                        liHtml += '<li class="lili" value="'+item.ddo_interviewrating_id+'">'+item.name+'</li>';
                    });
                    return '<div style="margin-top: -39px;"><img class="intvwratingimg-cls" src="resources/images/feeds/likes/' + ratingname + '.png' + '"><div style="position:absolute;">' + '<div class="act-cls">'+ratingname+'<i class="x-fa fa-sort-desc arrow-cls"></i><div class="act-removecls"><ul>'+liHtml+'</ul></div></div></div></div>';
                },
                convertDate: function(values) { /* to convert date and display*/
                    var intervwDate = values.interviewdate;
                    return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
                },
                showInterviewtime: function(values) {
                    return values.interviewtime.replace('-','.');
                },
                onIntervwTypeVal: function(values) {/*for interview type value*/
                    if (values.interviewtype == 1) {
                        return "Technical";
                    } else if(values.interviewtype == 2) {
                            return "HR";
                    }
                    else {
                        return "Manager";
                    }
                },
                onIntervwModeVal: function(values){
                    if(values.interviewmode == 1){
                        return "Telephonic";
                    }else if(values.interviewmode == 2){
                        return "Skype";
                    }else return "FacetoFace";
                },
                onFeedbackVal: function(values) { /* for feedbacks field display*/
                    if (values.feedback != "NULL" && values.feedback != null) {
                        return '<textarea class="intrvw_textarea" id="intrvw_textarea" placeholder="Write here..." name="feedbackTextArea" readonly>'+values.feedback+'</textarea>';
                    } else {
                        return '<textarea class="intrvw_textarea" placeholder="Write here..." name="feedbackTextArea"></textarea>';
                    }
                }
                // ,
                // onFeedbackSubmit: function(values) { /* for feedbacks field display*/
                //     if (values) {
                //         return '<button class="intvwsubmit-btn" name="submit" id="submit" >Submit</button><br>';
                //     } 
                //     else {
                //         return '<button class="intvwsubmit-btn" name="submit" id="submit" disabled>Submit</button><br>';
                //     }
                // }
            }
        ],
        itemSelector: '.feedbktable-cls',
        listeners: {
            itemclick: 'ratingsCheckClick',
            containerClick: function(vw, record, item) { /* on container click*/
                var x = vw.all.elements;
                for (var i = 0; i < x.length; i++) {
                    var y = x[i].lastChild.lastChild.children[4].lastChild.lastChild.lastChild.lastChild;
                    if (y.className == "act-showcls") {
                        y.classList.remove('act-showcls');
                        y.classList.add('act-removecls');
                    }
                }
            }
            // ,
            // el: {
            //         delegate: '.intrvw_textarea',
            //         keyup: function(cmp, a) {
            //                 if(a.value.length>0){
            //                 if(cmp.record.get('feedback_text') != true){
            //                 cmp.record.set('feedback_text',true);
            //                 cmp.record.set('feedback',a.value);
            //                 a.focus();

            //                 }
            //                 }else{
            //                      if(cmp.record.get('feedback_text') != false){
            //                       cmp.record.set('feedback_text',false);
            //                   }

            //                 }
                        
            //             }
            //     }
                
            
        }
    }]
});