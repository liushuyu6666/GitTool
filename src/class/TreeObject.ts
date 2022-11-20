// import { GitTreeObject } from "../interface/GitTreeObject";
// import { FileEntry } from "../interface/FileEntry";
// import { ObjectInGit } from "./Object";

// export class TreeObject extends ObjectInGit implements GitTreeObject {
//   fileEntries: FileEntry[];

//   constructor(rootDir: string, hash: string) {
//     super(rootDir, hash);
    
//     if (this.bufChunks.length < 3) {
//       console.error(`chunks in ${this.hash} less than 3`);
//       this.fileEntries = [];
//     } else {
//       let modeAndFile = this.bufChunks[1].toString();
//       let i = 2;
//       this.fileEntries = [];
//       while (modeAndFile.length > 0) {
//         const hash = this.bufChunks[i].slice(0, 20).toString('hex');
//         const fileEntry: FileEntry = {
//           'pointer': modeAndFile.split(' ')[1],
//           'mode': modeAndFile.split(' ')[0],
//           'hash': hash
//         }
//         this.fileEntries.push(fileEntry);
//         modeAndFile = this.bufChunks[i].slice(20).toString();
//         i++;
//       }
//     }
//   }
// }