Ext.define('JobsModule.overrides.data.Connection', {
    override: 'Ext.data.Connection',
    request: function(options) {
        if(options && options.url){
            if(options.url.indexOf(Api.URL.hostUrl) == -1 ){
                if(options.url.indexOf('resources/') == -1){
                    if(options.url.indexOf('/') == 0){
                        options.url = Api.URL.hostUrl + options.url.substring(1);
                    }else{
                        options.url = Api.URL.hostUrl + options.url;
                    }
                   
                }

            }
            options.withCredentials = true
        }
        this.callParent(arguments);
    }
});