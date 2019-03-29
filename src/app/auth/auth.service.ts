import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: User = new User();
  usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = this.db.collection<User>('users');
  }

  addUserToDB(user: User): void {
    this.usersCollection.doc(user.email).set({
      ...user
    }, { merge: true });
  }

  getAllUsers(): Observable<User[]> {
    return this.usersCollection.valueChanges();
  }

  getUser(firebaseUser: firebase.User): Observable<any> {
    const userRef = this.db.collection('users').doc(firebaseUser.email);
    return userRef.get();
  }

  isAuthenticated(): Observable<firebase.User> {
    return this.auth.authState;
  }

  getUserFromDB(userEmail: string): Observable<User[]> {
    const userQuery = this.db.collection<User>('users', ref => ref.where('email', '==', userEmail)).valueChanges();
    return userQuery;
  }

  login(email: string, password: string): Promise<any> {
    return this.auth.auth.signInWithEmailAndPassword(email, password); // .then(token => {
      // const userQuery = this.db.collection<User>('users', ref => ref.where('email', '==', token.user.email)).valueChanges();
      // userQuery.subscribe(docs => {
      //   this.user = docs[0]
      // });
    // });
  }

  /**
   * Create the user in Firebase Auth as well as in the Firebase DB for extra properties
   * @param email - Users email
   * @param password  - Users password
   */
  createEmployee(user: User, password: string): Promise<any> {
    return this.auth.auth.createUserWithEmailAndPassword(user.email, password).then(token => {
      // console.log('auth token', token);
      // this.usersCollection.doc(user.email).set({
      //   mjkId: user.mjkId,
      //   name: user.name,
      //   email: user.email,
      //   phone: user.phone,
      //   locations: user.locations,
      //   type: user.type,
      //   uid: token.user.uid
      // });
    });
  }

  deleteUser(user: User): Promise<any> {
    // return this.auth.auth.then(() => {
    return this.usersCollection.doc(user.email).delete().catch(error => console.error(`couldn't delete user`, error));
    // }).catch(error => console.error(`couldn't delete user`, error));
  }

  setUser(dbUser: User): void {
    if (dbUser) {
      // this.user.email = dbUser.email;
      // this.user.name = dbUser.name;
      // this.user.phone = dbUser.phone;
      // this.user.type = dbUser.type;
      // this.user.locations = dbUser.locations;
      // this.user.uid = dbUser.uid;
      // this.user.mjkId = dbUser.mjkId;
    }
  }

  updateUser(user: User): any { //Promise<any> {
    const date = new Date(user.signUpDate);
    console.log(date);
    user.signUpDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 16:29:41 UTC`;
    console.log(user.signUpDate);
    return this.usersCollection.doc(user.email).set({
      ...user
    }, { merge: true });
  }
}
