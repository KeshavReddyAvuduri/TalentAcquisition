/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('JobsModule.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	onItemSelected: function (sender, record) {
		Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
	},

	onConfirm: function (choice) {
		if (choice === 'yes') {
			//
		}
	},
	myfunction: function (keycloak) {
		setTimeout(() => {
			var isTokenExpired = keycloak.isTokenExpired();
			if (isTokenExpired) {
				keycloak.updateToken().success(function (res) { }).error(function () {
					alert('Failed to refresh token');
				});
			}
			this.myfunction(keycloak);
		}, 120000);
	},

	/**
	 * Function to check whether the user is logged in or not using keycloak server.
	 * creating keycloak object.
	 * checking for records at the server side and redirecting to addcontact or allcontact.
	 * @method checkForLogin whenever the page is refreshed. 
	 * @param component instance of main.
	 */
	onLoginClick: function (tokenParsed) {
		var formValues = { "email": tokenParsed.email },
			loginStore = Ext.create('JobsModule.store.Login');
		loginStore.load(formValues);
	},

	checkForLogin: function (component) {
		var me = this,
			masking = Ext.getBody().mask('Loading');
		var keycloak = KeycloakLoader.getKeycloak();
		if (!keycloak) {
			KeycloakLoader.initialize();
			keycloak = KeycloakLoader.getKeycloak();
		}

		window.keyCloak = keycloak;
		var token = sessionStorage.getItem('authentication');
		var refreshToken = sessionStorage.getItem('refreshToken');

		if (!sessionStorage.getItem('authentication')) {

			keycloak.init({
				onLoad: 'login-required'
			}).success(function (authenticated) {
				if (authenticated == true) {

					sessionStorage.setItem('authentication', keycloak.token);
					sessionStorage.setItem('refreshToken', keycloak.refreshToken);
					Ext.Ajax.setDefaultHeaders({
						'Authorization': 'Bearer ' + keycloak.token
					});

					me.onLoginClick(window.keyCloak.tokenParsed);
					Ext.ComponentQuery.query('preferencestypeslistView')[0].getViewModel().getStore('preferencestypelist').load();
				}
				masking.hide();
			}).error(function () {
				alert('failed to initialize');
			});
		} else {
			keycloak.init({ onLoad: 'login-required', token, refreshToken }).success(function (authenticated) {

				if (authenticated == true) {
					Ext.Ajax.request({

						url: Api.URL.userDetails.READ,
						method: "GET",
						params: {
							email: window.keyCloak.tokenParsed.email
						},
						success: function (res, result) {
							var responseText = JSON.parse(res.responseText);
							var loginStore = Ext.getStore('loginstore') || Ext.create('JobsModule.store.Login');
							if (loginStore.getCount() <= 0) {
								if (responseText) {
									loginStore.add([responseText.data]);
								}
							}
							Ext.ComponentQuery.query('preferencestypeslistView')[0].getViewModel().getStore('preferencestypelist').load();
						}
					})
				}
			})

		}



		masking.hide();

		// this.myfunction(keycloak);
	},
	onTabChange:function(){
		var store=Ext.ComponentQuery.query('preferencestypeslistView')[0].getViewModel().getStore('preferencestypelist').load();
	if(!store.isLoaded()){
		store.load();
	}
	},
	onLogoutClick: function () {
		var keycloak = KeycloakLoader.getKeycloak();
		keycloak.logout(true);
		// Ext.Ajax.request({
		// 	url: Api.URL.logout.LOGOUT,
		// 	method: "GET",
		// 	params: {},
		// 	success: function () {
		// 		sessionStorage.removeItem('authentication');
		// 		sessionStorage.removeItem('refreshToken');
		// 		if (!keycloak) {
		// 			KeycloakLoader.initialize();
		// 			keycloak = KeycloakLoader.getKeycloak();
		// 		}
		// 		keycloak.logout(true);
		// 		var me = this,
		// 			loginStore = Ext.getStore("login")
		// 		if (loginStore) {
		// 			loginStore.removeAll();
		// 		}
		// 	},
		// 	failure: function () {
		// 		sessionStorage.removeItem('authentication');
		// 		sessionStorage.removeItem('refreshToken');
		// 		keycloak.logout(true);
		// 	}
		// })


	}

});
