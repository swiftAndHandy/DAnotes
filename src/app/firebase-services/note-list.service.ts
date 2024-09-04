import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore, collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  regularNotes: Note[] = [];
  markedNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  items$;

  firestore: Firestore = inject(Firestore);

  constructor() {

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
    this.unsubMarkedNotes = this.subMarkedList();

    this.items$ = collectionData(this.getNotesRef());


  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }


  setNotesObject(obj: any): Note {
    return {
      'id': obj.id || '',
      'title': obj.title || '',
      'content': obj.content || '',
      'status': obj.status || 'regular',
      'marked': obj.marked || false,
    }
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNotesObject(element.data()));
      })
    });
  }

  subNotesList() {
    const q = query(this.getNotesRef(), orderBy("title"), limit(40));
    return onSnapshot(q, (list) => {
      this.regularNotes = [];
      list.forEach(element => {
        this.regularNotes.push(this.setNotesObject(element.data()));
      })
    });
  }

  subMarkedList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), orderBy("title"), limit(40));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach(element => {
        this.markedNotes.push(this.setNotesObject(element.data()));
      })
    });
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getCollectionIdFromNote(note: Note): string {
    if (note.status === 'trashed') {
      return 'trash';
    } else {
      return 'notes';
    }
  }

  async deleteNote(note: Note, fromLocation: 'notes' | 'trash') {
    if (note.id) {
      await deleteDoc(this.getSingleDocRef(fromLocation, note.id)).catch((err) => {
        console.warn(err);
      });
    }
  }


  async addNote(note: Note, status: 'regular' | 'trashed' = 'regular') {
    const target = status === 'regular' ? this.getNotesRef() : this.getTrashRef();
    await addDoc(target, note).catch((err) => {
      console.warn(err);
    }).then((docRef) => {
      console.log(`Document written with ID ${docRef?.id}.`);
      note.id = docRef?.id;
      this.updateNote(note);
      console.log(note.id);

    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      const docRef = this.getSingleDocRef(this.getCollectionIdFromNote(note), note.id);
      await updateDoc(docRef, this.getNoteAsJson(note)).catch((err) => {
        console.warn(err)
      }
      );
    }
  }

  getNoteAsJson(note: Note): object {
    return {
      id: note.id,
      status: note.status,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getSingleDocRef(collectionId: string, docId: string) {
    return doc(collection(this.firestore, collectionId), docId)
  }

}
