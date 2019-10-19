Ext.define('JobsModule.view.main.Routes', {
    extend: 'Ext.Mixin',
  
   /**
    * 
    * @param {*} activeItem 
    */
    makeActiveTab: function(activeItem){
        this.getView().setActiveItem(activeItem);
    },
    
  });               