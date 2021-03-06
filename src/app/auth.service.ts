import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  date = new Date();
  startDate = (this.date.getMonth() +1 )+ "/" + this.date.getDate() + "/" + this.date.getFullYear()

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user = afAuth.authState;
  }

  login() {
    console.log(this.startDate);
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user.subscribe(user => {
      if (user) {
        var ref = firebase.database().ref('/users');
        ref.once('value', (snapshot) => {
          if (!snapshot.hasChild(user.uid)) {
            var newUser = {
              startDate: this.startDate,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            }
            ref.child(user.uid).set(newUser);
          }
        });
      }
    })
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getCurrentUser() {
    return this.user;
  }

}
