import { Router } from '@angular/router';
import { ReminderService } from './../../services/reminder.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, FormGroup, FormControl } from '@angular/forms';
import { PoComboOption, PoModalAction, PoModalComponent, PoNotificationService, PoRadioGroupOption, PoTableAction } from '@po-ui/ng-components';
import { Reminder } from '../reminder-add/reminder-model';
import { first } from 'rxjs';
import { PoPageDynamicTableFilters } from '@po-ui/ng-templates';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss']
})
export class ReminderListComponent implements OnInit {
  @ViewChild('optionsForm', { static: true }) form!: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  formReminder!: FormGroup;

  //#region Reminder List
  reminderList: Array<any> = new Array();
  columnsTable: Array<any> = new Array();
  //#endregion

  reminder: Reminder = new Reminder();
  reminderValues = { id: "", title: "", priorityId: "", description: "" }; //array com os valores do fomulário
  reminderId: string | any;
  titleForm = 'Inclusão de Lembrete';

  //Adicionado ação deleter e editar
  actions: Array<PoTableAction> = [
    { action: this.updateReminder.bind(this), icon: 'po-icon-edit', label: 'Alterar Lembrete' },
    { action: this.deleteReminder.bind(this), icon: 'po-icon-delete', label: 'Excluir Lembrete' }
  ];

  fields: Array<PoPageDynamicTableFilters> = [
    { property: 'id', key: true, label: 'ID' },
    { property: 'title', filter: true, label: 'Título' },
    { property: 'priorityId', filter: true, label: 'Prioridade' },
    { property: 'description', filter: true, label: 'Descrição' },
  ];

  //método para editar o lembrete
  updateReminder(row: any) {
    console.log('Edit');
    const reminderId = row.id;
    this.router.navigate([`/optionsForm/${reminderId}`]);
  }

  //método para deleter o lembrete
  deleteReminder(row: any) {
    this.service
      .deleteReminder(row.id)
      .subscribe(
        {
          next: () => {
            this.onLoadReminder();
            this.poNotification.success('Lembrete excluido com sucesso');
          },
          error: (err) => this.poNotification.error(err)
        }
      );
  }

  reminderForm: string = '';
  fruits!: Array<string>;
  reminderDescription: string = '';

  close: PoModalAction = {
    action: () => {
      this.closeModal();
    },
    label: 'Close',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.proccessOrder();
    },
    label: 'Confirm'
  };

  public readonly reminderOptions: Array<PoComboOption> = [
    { value: '1', label: 'Baixa' },
    { value: '2', label: 'Média' },
    { value: '3', label: 'Alta' }
  ];

  constructor(
    private service: ReminderService,
    private router: Router,
    private poNotification: PoNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.onLoadReminder()
    this.columnsTable = this.service.getReminderColumns();

    this.formReminder = this.fb.group(
      {
        title: new FormControl(""),
        priority: new FormControl(""),
        description: new FormControl("")
      }
    )
  }

  //Metódo que se inscreve no serviço e atualiza a lista de lembretes
  onLoadReminder() {
    this.service.getReminder().subscribe(
      response => {
        this.reminderList = response;
        console.log(this.reminderList)
      }
    )
  }

  closeModal() {
    this.form.reset();
    this.poModal.close();
  }

  insertReminder() {
    this.proccessOrder();
  }

  proccessOrder() {
    if (this.form.invalid) {
      const orderInvalidMessage = 'Preencha os campos para salvar o lembrete.';
      this.poNotification.warning(orderInvalidMessage);
    } else {
      this.confirm.loading = true;
      this.insert();
      setTimeout(() => {
        this.poNotification.success(`Confirmação do Lembrete: ${this.fruits}, com prioridade: ${this.reminder}.`);
        this.confirm.loading = false;
        this.closeModal();
      }, 700);
    }
  }

  insert() {
    console.log('Inserted Method')
    const obj = {
      titleObj: this.formReminder.get('title')?.value,
      priorityObj: this.formReminder.get('priority')?.value,
      descriptionObj: this.formReminder.get('description')?.value
    }
    this.getReminder();
    // this.service.postReminder(JSON.stringify(this.reminder))
    this.service.postReminder(obj)
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

  restore() {
    this.form.reset();
  }

  openQuestionnaire() {
    this.poModal.open();
  }
}
