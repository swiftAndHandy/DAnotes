import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  regularNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  items$;

  firestore: Firestore = inject(Firestore);

  constructor() {

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

    this.items$ = collectionData(this.getNotesRef());
    

  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }


  setNotesObject(obj: any, id: string): Note {
    return {
      'id': id || '',
      'title': obj.title || '',
      'content': obj.content || '',
      'type': obj.type || 'note',
      'marked': obj.marked || false,
    }
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      //set to an empty array first? i doubt it.
      list.forEach(element => {
        this.trashNotes.push(this.setNotesObject(element.data(), element.id));
      })
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      //set to an empty array first? i doubt it.
      list.forEach(element => {
        this.regularNotes.push(this.setNotesObject(element.data(), element.id));
      })
    });
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  // getSingleDocRef(collectionId: string, docId: string) {
  //   return doc(collection(this.firestore, collectionId), docId)
  // }

}
