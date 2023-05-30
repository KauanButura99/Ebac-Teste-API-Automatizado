/// <reference types="cypress" />
import contrato from '../contracts/pordutos.contracts'

describe('Teste da funcionalidade produtos', () => {
  let token
  beforeEach(() => {
    cy.token("fulano@qa.com", "teste").then(tkn => { token = tkn })
  });

  it('Deve validar contrato de produtos', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body)
    })
  });


  it('Listar produtos', () => {
    cy.request({
      method: "GET",
      url: "produtos"
    }).then((response) => {
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

  it('Deve editar um produto ', () => {
    let produto = `produto ${Math.floor(Math.random() * 100000)}`
    cy.request("produtos").then(response => {
      let id = response.body.produtos[7]._id

      cy.request({
        method: "PUT",
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          "nome": produto,
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

  it('Deve editar um produto cadastrado previamente', () => {
    let produto = `produto ${Math.floor(Math.random() * 100000)}`

    cy.cadastrarProduto(token, produto, 1000, "CD", 1000)
      .then(response => {
        let id = response.body._id

        cy.request({
          method: "PUT",
          url: `produtos/${id}`,
          headers: { authorization: token },
          body: {
            "nome": produto,
            "preco": 4,
            "descricao": "Caneta de Ponta fina",
            "quantidade": 500
          }
        }).then((response) => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  });

  it('Deve exluir um produto', () => {
    let produto = `produto ${Math.floor(Math.random() * 10000)}`
    cy.cadastrarProduto(token, produto, 1000, "CD", 1000)
      .then(response => {
        let id = response.body._id

        cy.request({
          method: "DELETE",
          url: `produtos/${id}`,
          headers: { authorization: token }
        }).then((response) => {
          expect(response.body.message).to.equal("Registro excluído com sucesso")
          expect(response.status).to.equal(200)
        })
      })
  });


});