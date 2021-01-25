import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { CounterModule } from 'ngx-counter';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';

//Component
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsComponent } from './course/forms.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TablesComponent } from './student/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
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
import { MessagingService } from './services/message.service';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { ViewresultComponent } from './test/viewresult/viewresult.component';
import { StudentresultComponent } from './test/studentresult/studentresult.component';
import { AppsettingsComponent } from './appsettings/appsettings.component';


// All Material Modules---
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, DatePipe } from '@angular/common';

// All Firebase Modules ----
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAuthGuardModule, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { environment } from 'src/environments/environment';
import { StudentlistComponent } from './studentlist/studentlist.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    FormsComponent,
    ButtonsComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    AlertsComponent,
    AccordionsComponent,
    BadgesComponent,
    ProgressbarComponent,
    BreadcrumbsComponent,
    PaginationComponent,
    DropdownComponent,
    TooltipsComponent,
    CarouselComponent,
    TabsComponent,
    LoginComponent,
    SubjectsComponent,
    NewsComponent,
    BannerComponent,
    LivelectureComponent,
    MaterialComponent,
    TestComponent,
    QuestionComponent,
    TeacherComponent,
    ChatComponent,
    SendmessageComponent,
    ViewresultComponent,
    StudentresultComponent,
    AppsettingsComponent,
    StudentlistComponent,
    // MessagingService,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
    MatSortModule,
    MatProgressSpinnerModule ,
    MatTableModule,
    // MatDialogRef,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatRadioModule,
    NgSelectModule,
    CounterModule.forRoot(),
    NgxPaginationModule,
    ToastrModule.forRoot(), // ToastrModule added

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,


  ],
  providers: [
    DatePipe,
    MessagingService,
    AsyncPipe,
    NgSelectConfig,
    ɵs,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
