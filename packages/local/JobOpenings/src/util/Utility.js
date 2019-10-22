Ext.define('JobOpenings.util.Utility', {
    singleton: true,
    alternateClassName: ['Utility'],

    isProfileImage: true,

    isFormDirty: false,

    likeImgAnim: false,

    profileAppeared: null,

    todoEdited: false,

    userAboutData: null,

    ratingId: 0,

    dashboard: false,

    sliderEndRangeValue: null,

    toastReusable: null,

    myMask: null,

    nominatAlert: true,

    feedUploadsImage: [],

    shareValue: true,

    commentsData: null,

    feedEditedForm: null,

    menuform: true,

    metaUrlArr: [],

    postTimer: "",

    empDes: null,

    isNewlyAddedRecords: false,

    emptyTextDataArray: null,

    recCountValues: [],

    goalsArray: [],

    addedTags: [],

    deletedTags: [],

    goalsharetaggedList: [],

    //goaldate:null,

    projectPeopleId: null,

    nominateProjectId: null,

    hashCodeUrl: null,

    feedsStartValue: 0,

    isFeedScrollLoad: true,

    colorPicker: ['#ea4536', '#34a750', '#f8bb13', '#afafaf', '#131313'],

    filterObj: {},

    isIconSelected: false,

    isAlertActive: false,

    activeWindowCount: 0,

    isRendered: false,

    appImage: null,
    appChangedImage: [],
    isKarmaMaskLoaded : true,

    defaultUserImg:"this.src=`resources/images/profileImageMissing.jpg`",
    defaultImg:'resources/images/profileImageMissing.jpg',
    defaultPostImg:"this.src=`resources/images/postNotFound.jpg`",
    defaultProjectImg:"this.src=`resources/images/project.jpeg`",
    projectImg:"resources/images/project.jpeg",
    constructor: function(config) {
        var me = this;
        Ext.apply(this, config);
        this.initConfig(config);
        Ext.Ajax.on('requestexception', function(connection, response, options){
            if (response && response.status == 401){
                me.clearSession();  
            }
        });
    },

    clearSession : function(){
        sessionStorage.removeItem('authentication');
        sessionStorage.removeItem('refreshToken');
        var keycloak = KeycloakLoader.getKeycloak();
        if(!keycloak) {
            KeycloakLoader.initialize();
            keycloak = KeycloakLoader.getKeycloak();
        }
        keycloak.logout();
    },

    /**
     * To reuse the toast box
     * params -> align and message
     */
    toastReuseFn: function(align, message) {
        if (!Utility.toastReusable) {
            Utility.toastReusable = Ext.create('Ext.window.Toast', {
                closeAction: 'hide',
                align: align,
                saveDelay:3000
            });
        }
        Utility.toastReusable.update(message);
        Utility.toastReusable.show();
    },

    /**
     * To verify the image format
     * whether it is in JPG, JPEG, PNG format
     * params -> scope(scope), filefield, url, scb & fcb(callbacks)
     */
   

    //Reusable purpose for tap to the outside of the window
    onSetUpWinOutterTap: function(event, target, sourceController) {
        var messageBox = Ext.ComponentQuery.query('window')[0];
        if(messageBox && messageBox.isVisible()){
            return false;
        }
        var target = target || event.target,
            cls = target.getAttribute('class'),
            window, form, windowViewType,
            window = sourceController.getView(),
            form = window.down('form');

        if (cls && (cls.indexOf('x-mask') !== -1)) {

            windowViewType = sourceController.type;
            
            var selfnominatewindow = sourceController.getView();
            if (selfnominatewindow.xtype == 'karmaselfnominatewindow') {
                selfnominatewindow.close();
            }
            if (selfnominatewindow.xtype == 'karmanominatewindow') {
                window.close();
            }
            if (form) {
                if (form.isDirty() == false) {
                    if (windowViewType) {
                        //commented to remove animation for window outtertap.
                        /* Ext.create('Ext.fx.Anim', {
                             target: window,
                             duration: 500,
                             from: {
                                 bottom: 500,
                                 top: 150
                             },
                             to: {
                                 bottom: 150,
                                 top: -700
                             }
                         });

                         Ext.defer(function() {
                             window.close();
                         }, 500, window);*/
                        window.close();

                    }

                } else if (form.isDirty() == false) {
                    window.close();
                }
            } else {
                window.close();
            }

         }
    },

    topAlertMessage: function(title, message) {
        var confirmMsg = Ext.create('Ext.window.MessageBox', {
            closeAction: 'destroy',
            alwaysOnTop: true,
            modal : true,
            listeners: {
                activate: function(me, eOpts) {
                    Utility.nominatAlert = false;
                },
                deactivate: function(me, eOpts) {
                    Utility.nominatAlert = true;

                }
            }
        }).show({
            buttons: Ext.Msg.OK,
            title: title,
            message: message
        });

        return confirmMsg;
    },


    onDateField: function (dateField, e, eOpts) {
        var val = dateField.getRawValue();
        var validFullDate = Utility.isDate(val);
        if (validFullDate) {
            var todayDate = new Date(); 
            var dateSplit = validFullDate.split('-');
            var validDate = parseInt(dateSplit[0]);
            var validMonth = parseInt(dateSplit[1]);
            var validYear = parseInt(dateSplit[2]);
            var enteredDate = new Date(validYear,validMonth-1,validDate);
            todayDate.setHours(0,0,0,0);
            if(enteredDate < todayDate){
                 dateField.setValue('');
                 Utility.toastReuseFn('t',"<span style='color:red'>Entered date should not be before current Date</span>");       
            }
             else {
                dateField.setValue(validFullDate);    
            }
        }else{
            dateField.setValue('');
        }
    },
    
});
