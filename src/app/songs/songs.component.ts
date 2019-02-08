import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SongService } from './song.service';

@Component({
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

export class SongsComponent implements OnInit {
  @ViewChild('file') file;

  audioFile: File;
  files: Set<File> = new Set();
  form: FormGroup;
  isLoading = false;
  percentUploaded: number;
  uploadingAudio = false;
  constructor(
    private songService: SongService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      // content: new FormControl(null, {
      //   validators: [Validators.required]
      // }),
      audio: new FormControl(null, {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
      }),
      audioInstrumental: new FormControl(null, {
        validators: [Validators.required],
        // asyncValidators: [mimeType]
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
    const file = (event.target as HTMLInputElement).files[0];
    this.audioFile = (event.target as HTMLInputElement).files[0];
    console.log('got file');
    console.log(file);
    this.form.patchValue({audio: file});
    // this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveSong() {
    // if (this.form.valid) {
      // this.isLoading = true;
      // Upload the mp3 files to firebase
      const uploadTask = this.songService.uploadAudio(this.audioFile);
      const percentChangeObserver = uploadTask.percentageChanges()
        .subscribe(res => {
          this.percentUploaded = res;
        }, (error) => console.error(error),
        () => {
          percentChangeObserver.unsubscribe();
        }
      );
      const snapshotChanges = uploadTask.snapshotChanges()
        .subscribe((res) => {
        }, error => console.error(JSON.stringify(error)),
          () => {
            snapshotChanges.unsubscribe();
            const audioUrlObserver = this.songService.getAudioURL().subscribe(audioURL => {
              // this.newIssue.image = imageURL;
              console.log(audioURL);
              audioUrlObserver.unsubscribe();
              // this.uploadingImage = false;
              // this.viewCtrl.dismiss(this.newIssue);
            });
          }
        );
      this.form.reset();
    }
  // }
}
