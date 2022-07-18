import { ReminderListComponent } from './pages/reminder-list/reminder-list.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoModalPasswordRecoveryType, PoPageLoginAuthenticationType, PoPageLoginComponent } from '@po-ui/ng-templates';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  // {
  //   path: 'login', component: PoPageLoginComponent, data: {
  //     serviceApi: 'https://po-ui.io/sample/api/users/authentication', // https://my-json-server.typicode.com/belarminon/appLembrete/users
  //     environment: 'development',
  //     recovery: {
  //       url: 'https://po-ui.io/sample/api/users',
  //       type: PoModalPasswordRecoveryType.All,
  //       contactMail: 'dev.po@po-ui.com',
  //       phoneMask: '(99)99-99999-9999'
  //     },
  //     registerUrl: '/new-password', 
  //     authenticationType: PoPageLoginAuthenticationType.Basic
  //   }
  // }
  { path: '', component: ReminderListComponent },
  {
    path: 'lembrete', component: ReminderListComponent,
    data: {
      serviceApi: 'http://localhost:3000/tasks', // endpoint dos dados
      // serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados utilizando o método HTTP Get
      // serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados utilizando o método HTTP Post
    }
    //   }
    // ]
  },
  { path: 'lembrete/:id', component: ReminderListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
