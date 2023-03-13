import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../_services/accounts.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    
    @Output() cancelRegister = new EventEmitter();
    model: any = {};
    registerForm: FormGroup = new FormGroup({});

    constructor(private accountService: AccountsService, private toastr: ToastrService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
            confirmPassword: ['', [Validators.required, this.matchValues('password')]]
        });
        this.registerForm.controls['password'].valueChanges.subscribe({
            next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
        });
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
        };
    }

    register() {
        console.log(this.registerForm?.value);
        // this.accountService.register(this.model).subscribe({
        //     next: response => {
        //         this.cancel();
        //     },
        //     error: error => console.log(error) // this.toastr.error(error.error)
        // });
    }

    cancel() {
        console.log('Cancelled');
        this.cancelRegister.emit(false);
    }
}
