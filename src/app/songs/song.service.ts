import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Song } from './song.model';

@Injectable({ providedIn: 'root' })
export class SongService {

  // TanksCollection: AngularFirestoreCollection<Tank>;
  // TanksTemplateCollection: AngularFirestoreCollection<Tank>;
  // LocationCollection: AngularFirestoreCollection<{name: string}>;
  audioPath: string;
  imagePath: string;
  songsCollection: AngularFirestoreCollection<Song>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.songsCollection = this.db.collection<Song>('songs');
  }

  getAudioURL(): Observable<any> {
    return this.storage.ref(this.audioPath).getDownloadURL();
  }

  getImageURL(): Observable<any> {
    return this.storage.ref(this.imagePath).getDownloadURL();
  }

  saveSong(song: Song): Promise<any> {
    return this.songsCollection.doc(song.title).set({
      ...song
    }, { merge: true });
  }

  uploadAudio(audio: File): AngularFireUploadTask {
    this.audioPath = `/audio/${audio.name}`;

    // const imageBlob = this.dataURItoBlob(imageBase64);
    // this.fileRef = this.storage.ref(path);
    // const uploadTask = this.storage.ref(this.imagePath).put(imageBlob);
    const uploadTask = this.storage.upload(this.audioPath, audio);

    // this.fileRef = this.storage.ref(path);
    return uploadTask;
  }

  uploadImage(imageName: string, imageFile: File): AngularFireUploadTask {

    this.imagePath = `/images/${imageName}.svg`;
    console.log(this.imagePath);
    // const imageBlob = this.dataURItoBlob(imageBase64);
    const uploadTask = this.storage.upload(this.imagePath, imageFile);

    return uploadTask;
  }

  private dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }
}
