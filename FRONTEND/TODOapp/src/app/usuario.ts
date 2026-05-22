export class Usuario {
  _id?: string;
  nome: string;
  senha?: string;
  tipo: string;

  constructor(_nome: string, _senha: string, _tipo: string) {
    this.nome = _nome;
    this.senha = _senha;
    this.tipo = _tipo;
  }
}