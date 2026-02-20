/**
 * ==========================================================================
 * LIST-USER.DTO.TS — DTO de Saída (Resposta) de Usuário
 * ==========================================================================
 *
 * Este DTO controla QUAIS dados do usuário são expostos na resposta.
 * Perceba que ele NÃO contém email, password, createdAt, deletedAt...
 * Isso é ENCAPSULAMENTO (POO): esconder dados internos/sensíveis.
 *
 * "readonly" no construtor é um atalho do TypeScript que:
 *   1. Declara as propriedades id e name
 *   2. Atribui os valores recebidos no construtor
 *   3. Marca como somente leitura (não pode ser alterado depois)
 *
 * É equivalente a:
 *   readonly id: string;
 *   readonly name: string;
 *   constructor(id: string, name: string) {
 *     this.id = id;
 *     this.name = name;
 *   }
 * ==========================================================================
 */
export class ListUserDTO {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}
}
