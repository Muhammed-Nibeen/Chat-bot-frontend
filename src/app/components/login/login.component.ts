import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthserviceService } from '../../services/authservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup

  private loginSubscription: Subscription | null = null

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
  }


  get email(){
   return  this.loginForm.controls['email'];
  }

  get password(){
    return this.loginForm.controls['password']
  }

  

  constructor(private fb: FormBuilder,
    private authService: AuthserviceService,
    private router: Router,
    private messageService: MessageService ) {}

    loginDetails() {
      const { email, password } = this.loginForm.value;
      this.loginSubscription = this.authService.userLogin(email as string, password as string).subscribe(
        (response: any) => {
          console.log(response);
          if (response.message) {
            if (typeof localStorage !== 'undefined') {
              sessionStorage.setItem('user_token', response.token);
              if(typeof window!=='undefined'){
                localStorage.setItem('user_token', response.token);
                localStorage.setItem('user_refreshToken', response.refreshToken);
                localStorage.setItem('user_id',response.user._id)
                const data = localStorage.getItem('user_token')
                console.log("localStorage storage",data)
                localStorage.setItem('user', JSON.stringify(response.user));
                this.router.navigate(['home']);
              }
            } else {
              console.error('localStorage is not available');
            }
          }
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        }
      );
    }

    ngOnDestroy(): void {
      if(this.loginSubscription){
        this.loginSubscription.unsubscribe();
      }
            
    }
    
}
