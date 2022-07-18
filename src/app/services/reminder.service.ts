import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { ENVIROMENTS } from '../enviroments/env';
import { Reminder } from '../pages/reminder-add/reminder-model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  private url: string

  constructor(private http: HttpClient) {
    this.url = `${ENVIROMENTS.apiUrl}`
  }

  getPrioridades(): Observable<any> {
    return this.http.get(`${this.url}/priority`)
  }

  getReminder(): Observable<any> {
    return this.http.get(`${this.url}/tasks`)
  }

  //Método responsável por converter em nomes mais compreensivel para o usuário
  getReminderColumns(): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'ID' },
      {
        property: 'priorityId', label: 'Prioridade'
        // , type: 'label'
        // , labels: [
        //   { value: '1', color: 'color-07', label: 'Baixa' },
        //   { value: '2', color: 'color-08', label: 'Media' },
        //   { value: '3', color: 'color-12', label: 'Alta' }
        // ]
      },
      { property: 'title', label: 'Título' },
      { property: 'description', label: 'Descrição' }
    ];
  }
  //Método para buscar Lembrete por Id
  getReminderById(reminderId: string) {
    return this.http.get<Reminder>(`${this.url}/tasks/${reminderId}`);
  }
  //Método para inserir Lembrete
  postReminder(body: string) {
    return this.http.post(this.url, body)
  }
  //Método para remover Lembretes
  deleteReminder(Id: string) {
    console.log(Id)
    return this.http.delete(`${this.url}/tasks/${Id}`);
  }
  //Método para atualizar Lembrete
  putReminder(reminderId: string, body: string) {
    return this.http.put(`${this.url}/tasks/${reminderId}`, body);
  }

}
