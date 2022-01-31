
Cypress._.times(50,() => {
	describe('Stress Testing Messages Page', function() {
		before(function () {
			cy.viewport(1280, 720)
			cy.server()
			cy.route('POST', '/user/authenticate').as('userLogin')
			cy.route('GET','/api/v1/client/5e59d44230a5d333f453ef2f/feedback?filters[]=created_at**').as('filters') //filterXHR result
			cy.route('GET','/api/v1/warehouse-status').as('warehouseStatus')
			cy.visit('/')
			.get('#email').type('lito+superadmin@lanexus.com')
			.get('#password').type('Test123!')
			.get('#signin-btn').click()

		}) 
		it('Check Messages Page', function() {
			cy.wait('@userLogin').should('have.property', 'status', 200)
			cy.get('.row > :nth-child(1) > h2').should('contain','Account Management')
			cy.get('#clients-tab > .search-options-cont > :nth-child(2) > .checkmark').click({force:true})
			cy.get('#clients-tab > .search-options-cont > :nth-child(3) > .checkmark').click({force:true})
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').type('5e59d44230a5d333f453ef2f') //PROD
			cy.get('#clients-tab > .multiselect > .multiselect__tags > .multiselect__input').invoke('val').as('client_id')
			cy.get('@client_id').then((clientID) => {
				const client_id = clientID
				cy.get('.highlight').should('contain',client_id)
	  		  })	
			//SUDO LOGIN
			cy.get('.client-tab-list-cont > .text-right > :nth-child(2)').click({force:true})
			cy.wait('@warehouseStatus').should('have.property', 'status', 200)
			cy.wait(5000)
			// GO TO MESSAGES PAGE
			cy.get(':nth-child(5) > ul > :nth-child(5) > .mr-2').click({force:true})
			cy.wait('@filters').should('have.property', 'status', 200)
			//sign-out client admin
			cy.get('.sign-out-container > a > span').click({force:true})
			//sign-out super admin
			cy.wait(5000)
			cy.get('a > span').click()
		})
	
	})
})