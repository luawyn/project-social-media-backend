
# Projeto Labook

O Labook é uma rede social com o objetivo de promover a conexão e interação entre pessoas. 

Quem se cadastrar no aplicativo poderá criar e curtir publicações.
## Documentação da API

#### Cadastra um novo usuário

```http
  POST /users/signup
```
Endpoint público utilizado para cadastro. Devolve um token jwt.


| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`  | `object` | `name (string), email (string), password (string)` |

#### Login do usuário

```http
 POST /users/login
```
Endpoint público utilizado para login. Devolve um token jwt.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`  | `object` | `email (string), password (string)` |


#### Retorna todos os posts cadastrados

```http
  GET /posts
```
Endpoint protegido, requer um token jwt para acessá-lo.



| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`      | `string` | **Obrigatório**. O Token jwt |

#### Cadastra um novo post

```http
  POST /posts
```
Endpoint protegido, requer um token jwt para acessá-lo.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
`body`  | `object` | `content (string)` |

#### Edita um post

```http
  PUT /posts/:id
```
Endpoint protegido, requer um token jwt para acessá-lo.

Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |
`body`  | `object` | `content (string)` |

#### Deleta um post

```http
  DEL /posts/:id
```
Endpoint protegido, requer um token jwt para acessá-lo.

Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |

#### Curtir ou descurtir um post

```http
  PUT /posts/:id/like
```
Endpoint protegido, requer um token jwt para acessá-lo.

Quem criou o post não pode dar like ou dislike no mesmo.

Caso dê um like em um post que já tenha dado like, o like é desfeito.
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.

Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer | 
`body`  | `object` | `like (boolean)`  |


## Banco de Dados

![Diagram](https://user-images.githubusercontent.com/29845719/216036534-2b3dfb48-7782-411a-bffd-36245b78594e.png)
https://dbdiagram.io/d/63d16443296d97641d7c1ae1
