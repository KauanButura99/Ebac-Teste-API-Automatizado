/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import contrato from '../contracts/usuario.contrtacts'

describe('Testes da Funcionalidade Usuários', () => {


     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request("usuarios").then(response => {
               expect(response.status).to.equal(200)
               expect(response.body.usuarios[1].nome).to.equal('gabriel silva')
               expect(response.duration).to.be.lessThan(50)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario("true").then(response => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     })
});

it('Deve validar um usuário com email inválido', () => {
     cy.usuario("POST", "usuarios", "kauan", "kauanvictor.com.br", "teste", "true").then(response => {
          expect(response.body.email).to.equal('email deve ser um email válido')
          expect(response.status).to.equal(400)
     })
});

it('Deve editar um usuário previamente cadastrado', () => {
     cy.request("usuarios").then(response => {
          let id = response.body.usuarios[19]._id

          cy.request({
               method: "PUT",
               url: `usuarios/${id}`,
               body: {
                    "nome": faker.name.firstName(),
                    "email": faker.internet.email(),
                    "password": faker.internet.password(),
                    "administrador": "true"
               }
          }).then(response => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal("Registro alterado com sucesso")
          })
     })
});

it('Deve deletar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario("true").then(response => {
          cy.request({
               method: "DELETE",
               url: `usuarios/${response.body._id}`
          })
     }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Registro excluído com sucesso')
     })
});





