import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from "./usuario";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TODOapp');

  arrayDeTarefas = signal<Tarefa[]>([]);
  arrayDeUsuarios = signal<Usuario[]>([]);

  usuarioLogado = signal(false);
  tipoUsuario = signal('');

  tokenJWT = '{ "token": "" }';
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://apitarefasrudnei167140.onrender.com';
  }

  login(username: string, password: string) {
  const credenciais = {
    nome: username,
    senha: password
  };

  this.http.post<any>(`${this.apiURL}/api/login`, credenciais).subscribe({
    next: resultado => {
      this.tokenJWT = JSON.stringify(resultado);
      this.usuarioLogado.set(true);
      this.tipoUsuario.set(resultado.tipo);

      if (resultado.tipo === 'ADM') {
        this.READ_usuarios();
      }

      if (resultado.tipo === 'USUARIO') {
        this.READ_tarefas();
      }
    },
    error: erro => {
      console.log(erro);
      this.usuarioLogado.set(false);
      this.tipoUsuario.set('');
      alert('Usuário ou senha inválidos');
    }
  });
}

  getHeaders() {
    return new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    );
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);

    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, {
      headers: this.getHeaders()
    }).subscribe(
      resultado => {
        console.log(resultado);
        this.READ_tarefas();
      }
    );
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, {
      headers: this.getHeaders()
    }).subscribe({
      next: resultado => {
        this.arrayDeTarefas.set(resultado);
        this.usuarioLogado.set(true);
      },
      error: erro => {
        console.log(erro);
        this.usuarioLogado.set(false);
      }
    });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserRemovida);
    var id = this.arrayDeTarefas()[indice]._id;

    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`, {
      headers: this.getHeaders()
    }).subscribe(
      resultado => {
        console.log(resultado);
        this.READ_tarefas();
      }
    );
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas()[indice]._id;

    this.http.patch<Tarefa>(
      `${this.apiURL}/api/update/${id}`,
      tarefaAserModificada,
      {
        headers: this.getHeaders()
      }
    ).subscribe(
      resultado => {
        console.log(resultado);
        this.READ_tarefas();
      }
    );
  }
  CREATE_usuario(nomeNovoUsuario: string, senhaNovoUsuario: string, tipoNovoUsuario: string) {
  var novoUsuario = new Usuario(nomeNovoUsuario, senhaNovoUsuario, tipoNovoUsuario);

  this.http.post<Usuario>(`${this.apiURL}/api/users`, novoUsuario, {
    headers: this.getHeaders()
  }).subscribe(
    resultado => {
      console.log(resultado);
      this.READ_usuarios();
    }
  );
}

READ_usuarios() {
  this.http.get<Usuario[]>(`${this.apiURL}/api/users`, {
    headers: this.getHeaders()
  }).subscribe(
    resultado => this.arrayDeUsuarios.set(resultado)
  );
}

DELETE_usuario(usuarioAserRemovido: Usuario) {
  var indice = this.arrayDeUsuarios().indexOf(usuarioAserRemovido);
  var id = this.arrayDeUsuarios()[indice]._id;

  this.http.delete<Usuario>(`${this.apiURL}/api/users/${id}`, {
    headers: this.getHeaders()
  }).subscribe(
    resultado => {
      console.log(resultado);
      this.READ_usuarios();
    }
  );
}

UPDATE_usuario(usuarioAserModificado: Usuario) {
  var indice = this.arrayDeUsuarios().indexOf(usuarioAserModificado);
  var id = this.arrayDeUsuarios()[indice]._id;

  this.http.patch<Usuario>(
    `${this.apiURL}/api/users/${id}`,
    usuarioAserModificado,
    {
      headers: this.getHeaders()
    }
  ).subscribe(
    resultado => {
      console.log(resultado);
      this.READ_usuarios();
    }
  );
}
}