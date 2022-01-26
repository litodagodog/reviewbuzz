
Cypress._.times(1,() => {
	describe('Super Admin Page', function() {
		function customerName_Alpha_Numeric() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 10; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		} 
		before(function () {
			//cy.viewport(1024, 768)
			cy.viewport(1280, 720)
			cy.server()
			cy.route('POST', '/user/authenticate').as('userLogin')
			cy.route('GET','/api/v1/client/5be9eaa8ca50da00231cd33d/review/summary?report**').as('filters') //filterXHR result
			cy.route('GET','/api/v1/warehouse-status').as('warehouseStatus')
			cy.visit('/')
			.get('#email').type('lito+superadmin@lanexus.com')
			.get('#password').type('Test123!')
			.get('#signin-btn').click()

		}) 
		it('Stress Testing on Dashboard Page', function() {
			cy.wait('@userLogin').should('have.property', 'status', 200)
			//cy.wait('@accountMgnt').should('have.property', 'status', 200)
			cy.get('.row > :nth-child(1) > h2').should('contain','Account Management')
			cy.get('#clients-tab > .search-options-cont > :nth-child(2) > .checkmark').click({force:true})
			cy.get('#clients-tab > .search-options-cont > :nth-child(3) > .checkmark').click({force:true})
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5be9eaa8ca50da00231cd33d') //PROD
			//cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5bea2b74ca50da00214ea71a') //PROD
			//cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5cd4d7cb2ff63300292edd81') //STG
			//cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5bd7d4d520116100237fcd4c') //QA
			//cy.wait('@searchByClientID').should('have.property', 'status', 200)
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').invoke('val').as('client_id')
			cy.get('@client_id').then((clientID) => {
				const client_id = clientID
				cy.get('.highlight').should('contain',client_id)
	  		  })	
			//SUDO LOGIN
			cy.get('.client-tab-list-cont > .text-right > :nth-child(2)').click({force:true})
			cy.wait('@warehouseStatus').should('have.property', 'status', 200)
			cy.wait(5000)
			//filter last 12months
			cy.get('#period-filter-dropdown > div > a:nth-child(5)').click({force:true})
			cy.wait('@filters').should('have.property', 'status', 200)
			cy.wait(10000)
			//SIGN-OUT CLIENT ADMIN
			cy.get('.sign-out-container > a > span').click({force:true})
			//SIGN-OUT SUPER ADMIN
			cy.wait(5000)
			cy.get('a > span').click()
		})
	
	})
})