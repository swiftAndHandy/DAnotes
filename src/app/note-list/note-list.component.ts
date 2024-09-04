import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';



@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "regular" | "trashed" = "regular";

  constructor(private noteService: NoteListService) {

  }

  getList(typeOfNotes: 'regular' | 'trashed' ): Note[] {
    switch (typeOfNotes) {
      case 'regular':
        if (this.favFilter == 'all') {
          return this.noteService.regularNotes;
        } else {
          return this.noteService.markedNotes;
        }
      case 'trashed':
        return this.noteService.trashNotes;
    }
  }

  changeFavFilter(filter: "all" | "fav") {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == "trashed") {
      this.status = "regular";
    } else {
      this.status = "trashed";
      this.favFilter = "all";
    }
  }

}
