import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsComponent } from './course/forms.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TablesComponent } from './student/tables.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AccordionsComponent } from './accordions/accordions.component';
import { BadgesComponent } from './badges/badges.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TabsComponent } from './enroll-request/tabs.component';
import { LoginComponent } from './login/login.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { NewsComponent } from './news/news.component';
import { BannerComponent } from './banner/banner.component';
import { LivelectureComponent } from './livelecture/livelecture.component';
import { MaterialComponent } from './material/material.component';
import { TestComponent } from './test/test.component';
import { QuestionComponent } from './test/question/question.component';
import { TeacherComponent } from './teacher/teacher.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './guard/auth.guard';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { ViewresultComponent } from './test/viewresult/viewresult.component';
import { StudentresultComponent } from './test/studentresult/studentresult.component';
import { AppsettingsComponent } from './appsettings/appsettings.component';
import { StudentlistComponent } from './studentlist/studentlist.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['admin/credential']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  { path: '', redirectTo: 'admin/credential', pathMatch: 'full' },
  { path: 'admin/credential', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToDashboard }},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'appsetting', component: AppsettingsComponent ,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'teacher', component: TeacherComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'students', component: TablesComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },

  { path: 'studentlist', component: StudentlistComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'courses', component: FormsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'subjects', component: SubjectsComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'news', component: NewsComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'enrollrequest', component: TabsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'banner', component: BannerComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'livelec', component: LivelectureComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'material', component: MaterialComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'test', component: TestComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'question', component: QuestionComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'viewresult', component: ViewresultComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'studentresult', component: StudentresultComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'chat', component: ChatComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'sendmessage', component: SendmessageComponent , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'buttons', component: ButtonsComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'accordions', component: AccordionsComponent },
  { path: 'badges', component: BadgesComponent },
  { path: 'progressbar', component: ProgressbarComponent },
  { path: 'breadcrumbs', component: BreadcrumbsComponent },
  { path: 'pagination', component: PaginationComponent },
  { path: 'dropdowns', component: DropdownComponent },
  { path: 'tooltips', component: TooltipsComponent },
  { path: 'carousel', component: CarouselComponent },

  { path: '**', redirectTo: 'admin/credential' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
