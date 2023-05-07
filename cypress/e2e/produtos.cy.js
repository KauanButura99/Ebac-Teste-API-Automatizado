/// <reference types="cypress" />
describe('Teste da funcionalidade produtos', () => {
  let token
  beforeEach(() => {
    cy.token("fulano@qa.com", "teste").then(tkn => { token = tkn })
  });

  it('Listar produtos', () => {
    cy.request({
      method: "GET",
      url: "produtos"
    }).then((response) => {
      expect(response.body.produtos[22].nome).to.equal("Ebac")
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('produtos')
      expect(response.duration).to.be.lessThan(300)
    })
  });

  it('Cadastrar produto', () => {
    let produto = `produto ${Math.floor(Math.random() * 100000)}`

    cy.cadastrarProduto(token, produto, 1000, "CD", 1000)
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  });

  it.only('Deve editar um produto ', () => {
    cy.request("produtos").then(response => {
      cy.log(response.body.produtos[7]._id)
      let id = response.body.produtos[7]._id
      cy.request({
        method: "PUT",
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          "nome": "Caneta Faber Castell Vermelha",
          "preco": 4,
          "descricao": "Caneta de Ponta fina",
          "quantidade": 381
        }
      }).then((response) => {
        expect(response.body.message).to.equal("Registro alterado com sucesso")
        expect(response.status).to.equal(200)
      })
    })

  });


});