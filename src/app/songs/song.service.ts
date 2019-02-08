import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class SongService {

  // TanksCollection: AngularFirestoreCollection<Tank>;
  // TanksTemplateCollection: AngularFirestoreCollection<Tank>;
  // LocationCollection: AngularFirestoreCollection<{name: string}>;
  audioPath: string;

  constructor(
    private storage: AngularFireStorage
  ) {
  }

  getAudioURL(): Observable<any> {
    return this.storage.ref(this.audioPath).getDownloadURL();
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
}
