import { AuthService } from './../auth/auth.service';
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SongService } from './song.service';
import { Song, SongType } from './song.model';
import { MatSnackBar } from '@angular/material';
import { User } from '../auth/user.model';

@Component({
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

export class SongsComponent implements OnInit {
  @ViewChild('file') file;

  audioFile: File;
  imageFile: File;
  imageData: string;
  imageName: string;

  files: Set<File> = new Set();
  form: FormGroup;
  isLoading = false;
  percentAudioUploaded: number;
  percentImageUploaded: number;

  uploadingAudio = false;
  uploadingImage = false;

  isSaving = false;

  newSong: Song = new Song();

  csvText = '';

  SongType = SongType;

  // parse = require('csv-parse');

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      releaseDate: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      songType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      audio: new FormControl(null, {
        validators: [Validators.required],
      }),
      backgroundImage: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  addFile(): void {
    this.file.nativeElement.click();
  }

  // onFilesAdded(): void {
  //   const files: { [key: string]: File } = this.file.nativeElement.files;
  //   for (let key in files) {
  //     if (!isNaN(parseInt(key))) {
  //       this.files.add(files[key]);
  //     }
  //   }
  // }

  onAudioPicked(event: Event) {
    this.audioFile = (event.target as HTMLInputElement).files[0];
  }

  onImagePicked(event: Event): void {
    this.imageFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageData = reader.result as string;
    };
    reader.readAsDataURL(this.imageFile);
  }

  onCsvPicked(event: Event): void {
    const csv = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.csvText = reader.result as string;
      const userData = this.csvJSON(this.csvText);
      this.createUsers(userData);
    };
    reader.readAsText(csv);
  }

  onSaveSong() {
    // assign title
    this.newSong.title = this.form.get('title').value;
    this.newSong.releaseDate = this.form.get('releaseDate').value;
    this.newSong.songType = this.form.get('songType').value;

    this.uploadingAudio = true;
    const uploadAudioTask = this.songService.uploadAudio(this.audioFile);
    const percentChangeObserver = uploadAudioTask.percentageChanges()
      .subscribe(res => {
        this.percentAudioUploaded = res;
      }, (error) => console.error(error),
      () => {
        percentChangeObserver.unsubscribe();
      }
    );
    const snapshotChanges = uploadAudioTask.snapshotChanges()
      .subscribe((res) => {
      }, error => console.error(JSON.stringify(error)),
        () => {
          snapshotChanges.unsubscribe();
          const audioUrlObserver = this.songService.getAudioURL().subscribe(audioURL => {
            // this.newIssue.image = imageURL;
            console.log(audioURL);
            this.newSong.audioUrl = audioURL;
            audioUrlObserver.unsubscribe();
            this.uploadingAudio = false;
            this.uploadImage();
            // this.uploadingImage = false;
            // this.viewCtrl.dismiss(this.newIssue);
          });
        }
      );
    // this.form.reset();
  }
  // }

  uploadImage(): void {
    this.uploadingImage = true;
    const uploadImageTask = this.songService.uploadImage(this.newSong.title, this.imageFile);
    const percentChangeObserver = uploadImageTask.percentageChanges()
      .subscribe(res => {
        this.percentImageUploaded = res;
      }, (error) => console.error(error),
      () => {
        percentChangeObserver.unsubscribe();
      }
    );
    const snapshotChanges = uploadImageTask.snapshotChanges()
      .subscribe((res) => {
      }, error => console.error(JSON.stringify(error)),
        () => {
          snapshotChanges.unsubscribe();
          const imageUrlObserver = this.songService.getImageURL().subscribe(imageURL => {
            // this.newIssue.image = imageURL;
            console.log(imageURL);
            this.newSong.imageUrl = imageURL;
            imageUrlObserver.unsubscribe();
            console.log('going to save song');
            this.songService.saveSong(this.newSong).then(() => {
              this.isSaving = false;
              this.snackBar.open('Song Saved', '', {
                duration: 2000
              });
            });
            this.uploadingImage = false;
            // this.viewCtrl.dismiss(this.newIssue);
          });
        }
      );
  }

  /**
   * Annual
   *   {
    "First Name": "Leza",
    "Last Name": "Owens",
    "Email": "lfo429@hotmail.com",
    "Creation At": "2019-03-04 21:58:38 UTC",
    "Status": "approved",
    "Member Plan(s)": "Annual Plan",
    "Plan Status\r": "active\r"
  },

   *
   * Monthly
   * {
    "First Name": "Kristi",
    "Last Name": "Campbell",
    "Email": "j.g.k.c.mom@aol.com",
    "Creation At": "2018-11-05 03:18:37 UTC",
    "Status": "approved",
    "": "Month to Month - Start Jan 2019",
    "\r": "active\r"
  },
  */

  private createUsers(usersData: any): void {
    console.log(usersData);
    this.isLoading = true;
    usersData.forEach(userData => {
      // const creationDate = new Date(userData['Creation At']);
      if (userData['Member Plan(s)']) {
        let memberPlan = userData['Member Plan(s)'];
        if (userData['Member Plan(s)'].includes('Early') || userData['Member Plan(s)'].includes('Complementary')) {
          memberPlan = 'Early Bird Annual Plan';
        }
        const newUser = new User(
          userData['Email'],
          userData['First Name'],
          userData['Last Name'],
          '',
          memberPlan,
          'charge',
          userData['Creation At'],
          userData['Plan Status\r']);
        console.log(newUser);
        this.authService.addUserToDB(newUser);
      } else {
        const newUser = new User(
          userData['Email'],
          userData['First Name'],
          userData['Last Name'],
          'Month to Month',
          userData['Member Plan(s)'],
          'subscription',
          userData['Creation At'],
          userData[`\r`]);
        console.log(newUser);
        this.authService.addUserToDB(newUser);
      }
    });
    this.isLoading = false;
  }

  private csvJSON(csv): any {
    const lines = csv.split('\n');

    const result = [];

    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {

      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    return result;
  }
}
