
Cypress._.times(10,() => {
	describe('Stress Testing Reviews Page', function() {
		before(function () {
			cy.viewport(1280, 720)
			cy.server()
			cy.route('POST', '/user/authenticate').as('userLogin')
			cy.route('GET','/api/v1/warehouse-status').as('warehouseStatus')
			cy.route('GET','/api/v1/client/5bea2b74ca50da00214ea71a/review?filters[]=created_at**').as('reviewDate') //review page
			cy.visit('/')
			.get('#email').type('lito+superadmin@lanexus.com')
			.get('#password').type('Test123!')
			.get('#signin-btn').click()

		}) 
		it('Check Reviews Page', function() {
			cy.wait('@userLogin').should('have.property', 'status', 200)
			cy.get('.row > :nth-child(1) > h2').should('contain','Account Management')
			cy.get('#clients-tab > .search-options-cont > :nth-child(2) > .checkmark').click({force:true})
			cy.get('#clients-tab > .search-options-cont > :nth-child(3) > .checkmark').click({force:true})
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5bea2b74ca50da00214ea71a') //PROD
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').invoke('val').as('client_id')
			cy.get('@client_id').then((clientID) => {
				const client_id = clientID
				cy.get('.highlight').should('contain',client_id)
	  		  })	
			//SUDO LOGIN
			cy.get('.client-tab-list-cont > .text-right > :nth-child(2)').click({force:true})
			cy.wait('@warehouseStatus').should('have.property', 'status', 200)
			cy.wait(5000)
			//OPEN REVIEWS PAGE
			cy.get(':nth-child(5) > ul > :nth-child(3) > .mr-2').click({force:true})
			cy.wait('@reviewDate').should('have.property', 'status', 200)
			//sign-out client admin
			cy.get('.sign-out-container > a > span').click({force:true})
			//sign-out super admin
			cy.wait(2000)
			cy.get('a > span').click()
		})
	
	})
})