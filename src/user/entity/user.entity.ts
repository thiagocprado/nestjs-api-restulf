/**
 * ==========================================================================
 * USER.ENTITY.TS — Entidade de Usuário (Mapeamento Objeto-Relacional)
 * ==========================================================================
 *
 * O que é uma Entity?
 *   É uma classe que representa uma TABELA do banco de dados.
 *   Cada instância da classe = uma LINHA da tabela.
 *   Cada propriedade com @Column() = uma COLUNA da tabela.
 *
 * Isso é o coração do ORM (Object-Relational Mapping):
 *   Em vez de escrever SQL manualmente, você trabalha com objetos
 *   TypeScript e o TypeORM traduz para SQL automaticamente.
 *
 * POO — Classe como Representação de Dados:
 *   UserEntity modela o conceito de "Usuário" no domínio da aplicação.
 *   Contém dados (propriedades) e relacionamentos (orders).
 * ==========================================================================
 */
import { OrderEntity } from '../../order/entity/order.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

/**
 * @Entity({ name: 'users' }) — Mapeia esta classe para a tabela "users".
 * Sem o parâmetro name, o TypeORM usaria o nome da classe em minúsculas.
 */
@Entity({ name: 'users' })
export class UserEntity {
  /**
   * @PrimaryGeneratedColumn('uuid') — Chave primária gerada automaticamente.
   * 'uuid' indica que o ID será um UUID v4 (ex: "a1b2c3d4-e5f6-...")
   * ao invés de um número sequencial (1, 2, 3...).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @Column() — Mapeia esta propriedade para uma coluna da tabela.
   *   - name: nome da coluna no banco (pode diferir do nome da propriedade)
   *   - type: tipo de dado no PostgreSQL
   *   - length: tamanho máximo do varchar
   *   - nullable: se aceita NULL (false = obrigatório)
   */
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  /**
   * unique: true → cria uma constraint UNIQUE no banco.
   * Garante que não existam dois usuários com o mesmo email
   * (além da validação feita pelo UniqueEmailValidator no DTO).
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  /**
   * @CreateDateColumn — Preenchida automaticamente pelo TypeORM com a data/hora
   * de CRIAÇÃO do registro. Não precisa informar ao salvar.
   *
   * @UpdateDateColumn — Atualizada automaticamente pelo TypeORM a cada UPDATE.
   *
   * @DeleteDateColumn — Usada para SOFT DELETE (exclusão lógica).
   * Quando um registro é "soft deleted", ele NÃO é removido do banco —
   * apenas recebe uma data em deleted_at. O TypeORM ignora automaticamente
   * registros com deleted_at preenchido em consultas normais.
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  /**
   * @OneToMany — Relacionamento 1:N (Um para Muitos).
   *
   * Um usuário pode ter MUITOS pedidos (orders).
   * () => OrderEntity → a entidade do lado "muitos"
   * (order) => order.user → a propriedade da OrderEntity que referencia
   *   de volta o usuário (lado inverso do relacionamento)
   *
   * Este lado (User) NÃO tem a foreign key no banco.
   * A FK fica na tabela orders (coluna userId) — definida pelo @ManyToOne
   * na OrderEntity.
   */
  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
