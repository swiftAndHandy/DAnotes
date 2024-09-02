export interface Note {
    id?: string;
    status: "regular" | "trashed";
    title:string;
    content:string;
    marked: boolean;
}
