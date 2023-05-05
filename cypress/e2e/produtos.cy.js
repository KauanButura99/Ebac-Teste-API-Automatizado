/// <reference types="cypress" />
describe('Teste da funcionalidade produtos', () => {

  beforeEach(() => {
    let token
    cy.token("fulano@qa.com", "teste").then(tkn => { token = tkn })
  });

  it('Listar produtos', () => {
    cy.request({
      method: "GET",
      url: "produtos"
    }).then((response) => {
      expect(response.body.produtos[3].nome).to.equal("Alienware m17")
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('produtos')
      expect(response.duration).to.be.lessThan(300)
    })
  });

  it('Cadastrar produto', () => {
    cy.request({
      method: "POST",
      url: "produtos",
      body: {
        "nome": "Caneta Azul 1",
        "preco": 1,
        "descricao": "Caneta",
        "quantidade": 500
      },
      headers: { authorization: token }
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

});