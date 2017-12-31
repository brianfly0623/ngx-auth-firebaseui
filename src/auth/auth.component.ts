import {Component} from '@angular/core';
import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {ResponseSnackbarComponent} from './response/response.snackbar.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'ngx-auth-firebaseui',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.css']
})

export class AuthComponent {

    errorMessageExample1;
    emailFormControl: AbstractControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

    constructor(public afAuth: AngularFireAuth,
                private _iconRegistry: MatIconRegistry,
                private _sanitizer: DomSanitizer,
                private _snackbar: MatSnackBar) {
        _iconRegistry
            .addSvgIcon('google',
                _sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'))
            .addSvgIcon('facebook',
                _sanitizer.bypassSecurityTrustResourceUrl('/assets/facebook.svg'))
    }

    public async signInWithGoogle() {

        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((response) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = response.credential.accessToken;
                // The signed-in user info.
                var user = response.user;
                // ...
                console.log(response);
                this._snackbar.openFromComponent(ResponseSnackbarComponent, {
                    data: 'success'
                });
            }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.error(error);
            this._snackbar.open(error.message, 'OK', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        });
    }

}
