import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { ReminderService } from './../../services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Reminder } from './reminder-model';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-reminder-add',
  templateUrl: './reminder-add.component.html',
  styleUrls: ['./reminder-add.component.scss']
})
export class ReminderAddComponent implements OnInit {

  reminder: Reminder = new Reminder();
  reminderValues = { id: "", title: "", priorityId: "", description: "" }; //array com os valores do fomulário
  reminderId: string | any;
  titleForm = 'Inclusão de Lembrete';

  constructor(private service: ReminderService, private poNotification: PoNotificationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // define valores padrão para o formulário
    this.reminderValues = { id: "", title: "", priorityId: "", description: "" };
    this.route.paramMap.subscribe(
      parameters => {
        this.reminderId = parameters.get('id');
      }
    );

    if (this.reminderId) {
      this.titleForm = 'Alteração de Lombrete';
      this.setFormValue();
    }
  }

  //Método para atribuir valores aos campos para formulário
  setFormValue() {
    this.service
      .getReminderById(this.reminderId)
      .pipe(first())
      .subscribe((reminder: Reminder) => {
        console.log(reminder);
        this.reminderValues.id = reminder.id;
        this.reminderValues.title = reminder.title;
        this.reminderValues.priorityId = reminder.priorityId;
        this.reminderValues.description = reminder.description;
      });
  }

  insertReminder() {
    this.getReminder();
    this.service.postReminder(JSON.stringify(this.reminder))
      .pipe(first())
      .subscribe(
        {
          next: () => {
            this.poNotification.success('Lembrete foi inserido com Sucesso');
            this.router.navigate(['/lembrete'])
          },
          error: (err) => {
            let mesErr = JSON.parse(err.error.errorMessage);
            this.poNotification.error(`
              Erro código ${mesErr.code}, 
              ${decodeURIComponent(escape(mesErr.message))}, 
              detalhe: ${decodeURIComponent(escape(mesErr.detailedMessage))}.
            `)
          }
        }
      );
  }
  getReminder() {
    this.reminder.id = this.reminderValues.id;
    this.reminder.title = this.reminderValues.title;
    this.reminder.priorityId = this.reminderValues.priorityId;
    this.reminder.description = this.reminderValues.description;
  }

  fields: Array<PoDynamicFormField> = [
    {
      property: 'id',
      label: 'ID'
    },
    {
      property: 'title',
      label: 'Título'
    },
    {
      property: 'priorityId',
      label: 'Prioridade'
    },
    {
      property: 'description',
      label: 'Descrição'
    }
  ]

}
